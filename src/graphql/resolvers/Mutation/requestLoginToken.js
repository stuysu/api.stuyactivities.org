import { ForbiddenError, ApolloError } from 'apollo-server-express';
import cryptoRandomString from 'crypto-random-string';
import emailRenderer from './../../../utils/emailRenderer';
import urlJoin from 'url-join';
import { PUBLIC_URL } from '../../../constants';
import { parse } from 'node-html-parser';
import mailer from '../../../utils/mailer';
import moment from 'moment-timezone';

export default async (
	parent,
	{ email },
	{
		models: {
			loginTokens,
			users,
			Sequelize: { Op }
		}
	}
) => {
	const user = await users.emailLoader.load(email);

	if (!user) {
		throw new ApolloError(
			'There is no user with that email address',
			'USER_NOT_FOUND'
		);
	}

	if (user.email && user.email.endsWith('@stuy.edu') && !user.isFaculty) {
		throw new ForbiddenError(
			'Only faculty are allowed to use the magic link sign in method at this time.'
		);
	}

	const now = new Date();
	const fiveMinutes = 1000 * 60 * 5;
	const earliestValid = new Date(now.getTime() - fiveMinutes);
	const numTokensAlreadyRequested = await loginTokens.count({
		where: {
			createdAt: {
				[Op.gte]: earliestValid
			},
			userId: user.id,
			used: false
		}
	});

	if (numTokensAlreadyRequested >= 4) {
		throw new ForbiddenError(
			'You can only request a maximum of 4 magic links in a five minute period.'
		);
	}

	const tokenString = cryptoRandomString({ length: 128, type: 'url-safe' });

	const loginToken = await loginTokens.create({
		userId: user.id,
		used: false,
		token: tokenString
	});

	const expiration = moment(now)
		.add(30, 'm')
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const url = urlJoin(PUBLIC_URL, 'token', tokenString);
	const htmlEmail = emailRenderer.render('magicLink.html', {
		user,
		url,
		expiration
	});
	const plainTextMail = parse(htmlEmail).structuredText;

	await mailer.sendMail({
		from: '"StuyActivities Mailer" <mailer@stuyactivities.org>',
		to: user.email,
		subject: `✨ Magic Sign-In Link ✨ | StuyActivities`,
		text: plainTextMail,
		html: htmlEmail
	});

	return true;
};
