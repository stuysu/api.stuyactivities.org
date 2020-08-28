import { UserInputError } from 'apollo-server-express';
import { ApolloError } from 'apollo-server-errors';
import moment from 'moment-timezone';
import {
	alterCalendarEvent,
	createCalendarEvent,
	initOrgCalendar
} from '../../../googleApis/calendar';
import urlJoin from 'url-join';
import { PUBLIC_URL } from '../../../constants';

const markdownIt = require('markdown-it')({ html: false, linkify: true });

export default async (
	root,
	{ meetingId, title, description, start, end },
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

	const meeting = await meetings.idLoader.load(meetingId);

	if (!meeting) {
		throw new ApolloError(
			"There's no meeting with that id",
			'MEETING_NOT_FOUND'
		);
	}

	await session.orgAdminRequired(meeting.organizationId);

	if (title) {
		meeting.title = title;
	}

	if (description) {
		meeting.description = description;
	}

	const now = new Date();

	if (start) {
		const startDate = new Date(start);

		if (isNaN(startDate.getTime()) || startDate < now) {
			throw new UserInputError(
				'Start time is not valid or is in the past'
			);
		}
		meeting.start = startDate;
	}

	if (end) {
		const endDate = new Date(end);

		if (
			isNaN(endDate.getTime()) ||
			endDate < meeting.start ||
			endDate < now
		) {
			throw new UserInputError('End time is not valid or is in the past');
		}
		meeting.end = endDate;
	}

	await meeting.save();

	const formattedStart = moment(meeting.start)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const formattedEnd = moment(meeting.end)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const renderedDescription = markdownIt.render(description);

	const org = await organizations.idLoader.load(meeting.organizationId);

	const gEventInfo = {
		name: title,
		description: renderedDescription,
		start: meeting.start.toISOString(),
		end: meeting.end.toISOString(),
		source: {
			title: `Meeting by ${org.name} | StuyActivities`,
			url: urlJoin(PUBLIC_URL, org.url, 'meetings', meeting.id)
		}
	};

	let googleEvent = googleCalendarEvents.meetingIdLoader.load(meeting.id);

	if (!googleEvent) {
		let googleCalendar = await googleCalendars.orgIdLoader.load(
			meeting.organizationId
		);

		if (!googleCalendar) {
			googleCalendar = await initOrgCalendar(meeting.organizationId);
		}

		const gCalEvent = await createCalendarEvent(
			googleCalendar.gCalId,
			gEventInfo
		);

		await googleCalendarEvents.create({
			googleCalendarId: googleCalendar.id,
			meetingId: meeting.id,
			gCalEventId: gCalEvent.id
		});
	} else {
		await alterCalendarEvent(
			googleEvent.googleCalendarId,
			googleEvent.gCalEventId,
			gEventInfo
		);
	}

	return meeting;
};
