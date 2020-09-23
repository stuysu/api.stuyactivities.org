import { UserInputError } from 'apollo-server-express';
import { ApolloError } from 'apollo-server-errors';
import sendEmail from '../../../utils/sendEmail';
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
	{ meetingId, title, description, start, end, notifyMembers },
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
		if (start < now) {
			throw new UserInputError(
				'Start time is not valid or is in the past'
			);
		}
		meeting.start = start;
	}

	if (end) {
		if (end < meeting.start || end < now) {
			throw new UserInputError('End time is not valid or is in the past');
		}
		meeting.end = end;
	}

	await meeting.save();

	const formattedStart = moment(meeting.start)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const formattedEnd = moment(meeting.end)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const renderedDescription = markdownIt.render(meeting.description);

	const org = await organizations.idLoader.load(meeting.organizationId);

	if (notifyMembers) {
		const members = await users.findAll({
			include: {
				model: memberships,
				where: {
					organizationId: meeting.organizationId
				},
				required: true
			}
		})

		for (let i = 0; i < members.length; i++) {
			const member = members[i];

			await sendEmail({
				to: member.email,
				subject: `${org.name} altered a meeting | StuyActivities`,
				template: 'alterMeetingNotification.html',
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
	}


	const gEventInfo = {
		name: title,
		description: renderedDescription,
		start: meeting.start.toISOString(),
		end: meeting.end.toISOString(),
		source: {
			title: `Meeting by ${org.name} | StuyActivities`,
			url: urlJoin(PUBLIC_URL, org.url, 'meetings', String(meeting.id))
		}
	};

	let googleEvent = await googleCalendarEvents.meetingIdLoader.load(
		meeting.id
	);

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
		const googleCalendar = await googleCalendars.idLoader.load(
			googleEvent.googleCalendarId
		);

		await alterCalendarEvent(
			googleCalendar.gCalId,
			googleEvent.gCalEventId,
			gEventInfo
		);
	}

	return meeting;
};
