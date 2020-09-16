import emailRenderer from '../../../utils/emailRenderer';
import { parse } from 'node-html-parser';
import mailer from '../../../utils/mailer';
import { ApolloError, ForbiddenError } from 'apollo-server-express';

export default async (parent, args, context) => {
	const {
		session,
		models: { strikes, users }
	} = context;

	session.authenticationRequired([]);
	await session.adminRoleRequired('Strikes', ['createStrike']);

	let { orgId, weight, reason, reviewerId } = args;

	const strike = await strikes.create({
		orgId,
		weight,
		reviewerId,
		reason
	});

	// const user = await users.emailLoader.load(email);
	//
	// if (!user) {
	// 	throw new ApolloError(
	// 		'There is no user with that email address',
	// 		'USER_NOT_FOUND'
	// 	);
	// }
	//
	// if (user.email && user.email.endsWith('@stuy.edu') && !user.isFaculty) {
	// 	throw new ForbiddenError(
	// 		'Only faculty are allowed to use the magic link sign in method at this time.'
	// 	);
	// }
	//
	// const htmlEmail = emailRenderer.render('strike.html', {
	// 	user,
	// 	reason
	// });
	// const plainTextMail = parse(htmlEmail).structuredText;
	//
	// await mailer.sendMail({
	// 	from: '"StuyActivities Mailer" <mailer@stuyactivities.org>',
	// 	to: user.email,
	// 	subject: `Strikes | StuyActivities`,
	// 	text: plainTextMail,
	// 	html: htmlEmail
	// });
};
