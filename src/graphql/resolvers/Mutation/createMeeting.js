import { UserInputError, ForbiddenError } from 'apollo-server-express';
import moment from 'moment-timezone';
import emailRenderer from '../../../utils/emailRenderer';
import { parse } from 'node-html-parser';
import sendEmail from '../../../utils/sendEmail';

export default async (
	root,
	{ orgId, orgUrl, title, description, start, end },
	{ models: { organizations, meetings, users, memberships }, session }
) => {
	session.authenticationRequired(['createMeeting']);

	if (!orgId && !orgUrl) {
		throw new UserInputError(
			'You need to provide an organization id or organization url in order to create a meeting',
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

	if (!org.active) {
		throw new ForbiddenError(
			'Only approved organizations are allowed to schedule meetings'
		);
	}

	await session.orgAdminRequired(org.id);

	if (!title) {
		throw new UserInputError('A title must be provided for the meeting', {
			invalidArgs: ['title']
		});
	}

	const now = new Date();
	const startDate = new Date(start);
	const endDate = new Date(end);

	if (isNaN(startDate.getTime()) || startDate < now) {
		throw new UserInputError('Start date is not valid', {
			invalidArgs: ['start']
		});
	}

	if (isNaN || endDate < startDate || endDate < now) {
		throw new UserInputError('End date is not valid', {
			invalidArgs: ['end']
		});
	}

	const meeting = await meetings.create({
		organizationId: org.id,
		title,
		description,
		start: startDate,
		end: endDate
	});

	const members = await users.findAll({
		include: {
			model: memberships,
			where: {
				organizationId: org.id
			},
			required: true
		}
	});
	const formattedStart = moment(startDate)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const formattedEnd = moment(endDate)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	for (let i = 0; i < members.length; i++) {
		const member = members[i];

		await sendEmail({
			to: member.email,
			subject: `${org.name} scheduled a meeting | StuyActivities`,
			template: 'strikeNotification.html',
			variables: {
				member,
				org,
				meeting,
				formattedStart,
				formattedEnd
			}
		});
	}

	return meeting;
};
