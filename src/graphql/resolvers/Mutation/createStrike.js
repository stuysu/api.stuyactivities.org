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

	let { orgId, weight, reason, reviewerId } = args;

	const reviewer = await users.findOne({ where: { id: session.userId } });

	const strike = await strikes.create({
		orgId,
		weight,
		reviewerId,
		reason
	});

	const leaderUsers = await users.findAll({ where: { id: leaders } });
	for (let i = 0; i < leaderUsers.length; i++) {
		const leader = leaderUsers[i];

		const htmlMail = emailRenderer.render('strike.html', {
			leader: leader,
			reason: reason
		});
		const plainTextMail = parse(htmlMail).structuredText;

		await mailer.sendMail({
			from: '"StuyActivities Mailer" <mailer@stuyactivities.org>',
			to: leader.email,
			subject: `Strike: ${org.name} | StuyActivities`,
			text: plainTextMail,
			html: htmlMail
		});
	}
};
