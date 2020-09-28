import sendEmail from '../../../utils/sendEmail';
import { UserInputError } from 'apollo-server-express';
import moment from 'moment-timezone';
import urlJoin from 'url-join';
import { PUBLIC_URL } from '../../../constants';

export default async (parent, args, context) => {
	const {
		session,
		models: { strikes, users, organizations, memberships }
	} = context;

	session.authenticationRequired(['createStrike']);
	await session.adminRoleRequired('strikes', ['createStrike']);

	let { orgId, orgUrl, weight, reason } = args;

	if (!orgId && !orgUrl) {
		throw new UserInputError(
			'You must provide an organization id or url to assign a strike.',
			{
				invalidArgs: ['orgId', 'orgUrl']
			}
		);
	}

	let org;

	if (orgId) {
		org = await organizations.idLoader.load(orgId);
	} else if (orgUrl) {
		org = await organizations.urlLoader.load(orgUrl);
	}

	const strike = await strikes.create({
		organizationId: org.id,
		reviewerId: context.session.userId,
		weight,
		reason
	});

	const orgAdmins = await users.findAll({
		include: {
			model: memberships,
			where: {
				organizationId: org.id,
				adminPrivileges: true
			}
		}
	});

	const formattedTime = moment(strike.createdAt)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const appealUrl = urlJoin(
		PUBLIC_URL,
		org.url,
		'admin/strikes',
		String(strike.id)
	);

	for (let i = 0; i < orgAdmins; i++) {
		const user = orgAdmins[i];

		await sendEmail({
			to: user.email,
			subject: `${org.name} received a strike | StuyActivities`,
			template: 'strikeNotification.html',
			variables: {
				user,
				strike,
				formattedTime,
				appealUrl
			}
		});
	}

	return strike;
};
