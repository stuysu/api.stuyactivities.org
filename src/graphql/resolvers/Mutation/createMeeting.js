import { ForbiddenError, UserInputError } from 'apollo-server-express';
import moment from 'moment-timezone';
import sendEmail from '../../../utils/sendEmail';
import {
	createCalendarEvent,
	initOrgCalendar
} from '../../../googleApis/calendar';
import urlJoin from 'url-join';
import { PUBLIC_URL } from '../../../constants';

const markdownIt = require('markdown-it')({ html: false, linkify: true });

export default async (
	root,
	{ orgId, orgUrl, title, description, start, end, notifyFaculty },
	{
		models: {
			organizations,
			meetings,
			users,
			memberships,
			googleCalendars,
			googleCalendarEvents
		},
		session
	}
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

	if (start < now) {
		throw new UserInputError('Start date is not valid', {
			invalidArgs: ['start']
		});
	}

	if (end < start || end < now) {
		throw new UserInputError('End date is not valid', {
			invalidArgs: ['end']
		});
	}

	const meeting = await meetings.create({
		organizationId: org.id,
		title,
		description,
		start,
		end
	});

	const where = {};
	
	if(! notifyFaculty){
		where.isFaculty = false;	
	}
	
	const members = await users.findAll({
		where,
		include: {
			model: memberships,
			where: {
				organizationId: org.id
			},
			required: true	
		}
	});

	const formattedStart = moment(start)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const formattedEnd = moment(end)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const renderedDescription = markdownIt.render(description);

	for (let i = 0; i < members.length; i++) {
		const member = members[i];

		await sendEmail({
			to: member.email,
			subject: `${org.name} scheduled a meeting | StuyActivities`,
			template: 'meetingNotification.html',
			variables: {
				member,
				org,
				meeting,
				formattedStart,
				formattedEnd,
				renderedDescription
			}
		});
	}

	// Add the meeting to the google calendar
	let googleCalendar = await googleCalendars.orgIdLoader.load(org.id);

	if (!googleCalendar) {
		googleCalendar = await initOrgCalendar(org.id);
	}

	const googleEvent = await createCalendarEvent(googleCalendar.gCalId, {
		name: title,
		description: renderedDescription,
		start: start.toISOString(),
		end: end.toISOString(),
		source: {
			title: `Meeting by ${org.name} | StuyActivities`,
			url: urlJoin(PUBLIC_URL, org.url, 'meetings', String(meeting.id))
		}
	});

	await googleCalendarEvents.create({
		googleCalendarId: googleCalendar.id,
		meetingId: meeting.id,
		gCalEventId: googleEvent.id
	});

	return meeting;
};
