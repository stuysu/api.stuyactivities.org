import { ApolloError } from 'apollo-server-express';
import cryptoRandomString from 'crypto-random-string';
const mailer = require('../../../utils/mailer');
const emailRenderer = require('../../../utils/emailRenderer');
import HTMLParser from 'node-html-parser';
import urlJoin from 'url-join';
const { PUBLIC_URL } = require('../../../constants');

export default async (root, args, context) => {
	const { email } = args;
	const { users, passwordResets, Sequelize } = context.models;

	const user = await users.findOne({
		where: {
			email
		}
	});

	if (!user) {
		throw new ApolloError(
			'There is no user with that email address',
			'USER_NOT_FOUND'
		);
	}

	const thirtyMinInMilliseconds = 1000 * 60 * 30;

	const thirtyMinAgo = new Date(
		new Date().getTime() - thirtyMinInMilliseconds
	);

	const numResets = await passwordResets.count({
		where: {
			userId: user.id,
			createdAt: {
				[Sequelize.Op.gt]: thirtyMinAgo
			}
		}
	});

	if (numResets >= 5) {
		throw new ApolloError(
			`You have already requested ${numResets} password resets in the past 30 minutes. Please wait a bit before trying again.`,
			'TOO_MANY_REQUESTS'
		);
	}

	const tokenLength = 100 + Math.floor(Math.random() * 29);

	const token = cryptoRandomString({ length: tokenLength, type: 'url-safe' });

	await passwordResets.create({ userId: user.id, token });

	const url = urlJoin(PUBLIC_URL, 'reset-password', token);

	const htmlMail = emailRenderer.render('resetPassword.html', { user, url });
	const plainTextMail = HTMLParser.parse(htmlMail).structuredText;

	await mailer.sendMail({
		from: '"StuyActivities Mailer" <mailer@stuyactivities.org>',
		to: user.email,
		subject: 'Password Reset Request | StuyActivities',
		text: plainTextMail,
		html: htmlMail
	});

	return true;
};
