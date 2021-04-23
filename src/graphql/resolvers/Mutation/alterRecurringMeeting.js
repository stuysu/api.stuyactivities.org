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
import recurringMeetingGEventInfo from '../../../utils/recurringMeetingGEventInfo';
import destroyRecurringMeetingChildren from '../../../utils/destroyRecurringMeetingChildren';

const markdownIt = require('markdown-it')({ html: false, linkify: true });

export default async (
	root,
	{
		recurringMeetingId,
		title,
		description,
		start,
		end,
		dayOfWeek,
		notifyMembers,
		privacy,
		frequency
	},
	{
		models: {
			organizations,
			recurringMeetings,
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

	const recurringMeeting = await recurringMeetings.idLoader.load(
		recurringMeetingId
	);

	if (!recurringMeeting) {
		throw new ApolloError(
			"There's no recurring meeting with that id",
			'MEETING_NOT_FOUND'
		);
	}

	await session.orgAdminRequired(recurringMeeting.organizationId);

	if (title) {
		recurringMeeting.title = title;
	}

	if (description) {
		recurringMeeting.description = description;
	}

	if (privacy && ['public', 'private'].includes(privacy)) {
		recurringMeeting.privacy = privacy;
	}

	const now = new Date();

	if (start) {
		recurringMeeting.start = start;
	}
	if (end) {
		recurringMeeting.end = end;
	}

	if (frequency) {
		if (frequency < 1) {
			throw new UserInputError('Frequency is not valid');
		}
		recurringMeeting.frequency = frequency;
	}
	//Sunday - Saturday: 0 - 6
	if (dayOfWeek) {
		if (dayOfWeek < 1 || dayOfWeek > 5) {
			throw new UserInputError('Day of week is not valid');
		}
		recurringMeeting.dayOfWeek = dayOfWeek;
	}

	await recurringMeeting.save();

	await destroyRecurringMeetingChildren({ recurringMeeting, meetings });

	const org = await organizations.idLoader.load(
		recurringMeeting.organizationId
	);
	const gEventInfo = recurringMeetingGEventInfo({
		title: recurringMeeting.title,
		description: recurringMeeting.description,
		start: recurringMeeting.start,
		end: recurringMeeting.end,
		frequency: recurringMeeting.frequency,
		dayOfWeek: recurringMeeting.dayOfWeek,
		orgName: org.name,
		orgUrl: org.url
	});

	let googleEvent = await googleCalendarEvents.findOne({
		where: {
			meetingId: recurringMeeting.id,
			recurringMeeting: true
		}
	});

	if (!googleEvent) {
		let googleCalendar = await googleCalendars.orgIdLoader.load(
			recurringMeeting.organizationId
		);

		if (!googleCalendar) {
			googleCalendar = await initOrgCalendar(
				recurringMeeting.organizationId
			);
		}

		const gCalEvent = await createCalendarEvent(
			googleCalendar.gCalId,
			gEventInfo
		);

		await googleCalendarEvents.create({
			googleCalendarId: googleCalendar.id,
			meetingId: recurringMeeting.id,
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

	// refer to src/graphql/resolvers/Organization/recurringMeetings.js for an explanation
	recurringMeeting.start = new Date(recurringMeeting.start);
	recurringMeeting.end = new Date(recurringMeeting.end);
	return recurringMeeting;
};
