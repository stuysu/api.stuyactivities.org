import emailRenderer from '../../../utils/emailRenderer';
import { parse } from 'node-html-parser';
import mailer from '../../../utils/mailer';

export default async (parent, args, context) => {
	const {
		session,
		models: { strikes, users }
	} = context;

	session.authenticationRequired([]);
	await session.adminRoleRequired('Strikes', ['createStrike']);

	let { organizationId, weight, reviewer, reason, email } = args;

	const user = await users.emailLoader.load(email);

	const strike = await strikes.create({
		organizationId,
		weight,
		reviewer,
		reason
	});

	const htmlEmail = emailRenderer.render('strike.html', {
		user,
		reason
	});
	const plainTextMail = parse(htmlEmail).structuredText;

	await mailer.sendMail({
		from: '"StuyActivities Mailer" <mailer@stuyactivities.org>',
		to: user.email,
		subject: `Strikes | StuyActivities`,
		text: plainTextMail,
		html: htmlEmail
	});
};
