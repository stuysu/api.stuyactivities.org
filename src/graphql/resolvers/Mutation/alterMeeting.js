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
import { PUBLIC_URL } from '../../../constants.js';
import sanitizeHtml from '../../../utils/sanitizeHtml';

const markdownIt = require('markdown-it')({ html: false, linkify: true });

export default async (
	root,
	{
		meetingId,
		title,
		description,
		start,
		end,
		privacy,
		notifyMembers,
		groupId
	},
	{
		models: {
			organizations,
			meetings,
			users,
			memberships,
			googleCalendars,
			googleCalendarEvents
		},
		authenticationRequired,
		orgAdminRequired
	}
) => {
	authenticationRequired();

	const meeting = await meetings.idLoader.load(meetingId);

	if (!meeting) {
		throw new ApolloError(
			"There's no meeting with that id",
			'MEETING_NOT_FOUND'
		);
	}

	orgAdminRequired(meeting.organizationId);

	if (groupId) {
		meeting.groupId = groupId;
	}

	if (title) {
		meeting.title = title;
	}

	if (description) {
		meeting.description = sanitizeHtml(description);
	}

	if (privacy && ['public', 'private'].includes(privacy)) {
		meeting.privacy = privacy;
	}

	const now = new Date();

	if (start) {
		if (start < now) {
			throw new UserInputError(
				"Start time is not valid or is in the past (if you're using safari, make sure your date is in mm/dd/yyyy format)"
			);
		}
		/* TEMPORARILY COMMENTED OUT TO PREVENT BUG INVOLVING OVERBOOKING
		meeting.start = start;
		*/
	}

	if (end) {
		if (end < meeting.start || end < now) {
			throw new UserInputError(
				"End time is not valid or is in the past (if you're using safari, make sure your date is in mm/dd/yyyy format)"
			);
		}
		/* TEMPORARILY COMMENTED OUT TO PREVENT BUG INVOLVING OVERBOOKING
		meeting.end = end;
		*/
	}

	await meeting.save();

	const formattedStart = moment(meeting.start)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const formattedEnd = moment(meeting.end)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const safeDescription = meeting.description;

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
		});

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
					renderedDescription: safeDescription
				}
			});
		}
	}

	const gEventInfo = {
		name: title,
		description: safeDescription,
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
			gCalEventId: gCalEvent.id,
			recurringMeeting: true
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

	// TEMPORARY CODE TO PREVENT OVERBOOKING BUG
	if (start != meeting.start || end != meeting.end) {
		throw new UserInputError(
			'You may not edit start or end times of a meeting to prevent a bug involving room overbooking. Any other edits have been saved, but your start & end times are as before.'
		);
	}
	// END TEMPORARY CODE
	return meeting;
};
