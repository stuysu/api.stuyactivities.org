import { ForbiddenError, UserInputError } from 'apollo-server-express';
import moment from 'moment-timezone';
import sendEmail from '../../../utils/sendEmail';
import {
	createCalendarEvent,
	initOrgCalendar
} from '../../../googleApis/calendar';
import { Op } from 'sequelize';
import urlJoin from 'url-join';
import { PUBLIC_URL } from '../../../constants';
import recurringMeetingGEventInfo from '../../../utils/recurringMeetingGEventInfo';

const markdownIt = require('markdown-it')({ html: false, linkify: true });

export default async (
	root,
	{
		orgId,
		orgUrl,
		title,
		description,
		privacy,
		start,
		end,
		dayOfWeek,
		frequency
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
		session
	}
) => {
	session.authenticationRequired(['createRecurringMeeting']);

	if (!orgId && !orgUrl) {
		throw new UserInputError(
			'You need to provide an organization id or organization url in order to create a recurring meeting',
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
		throw new UserInputError(
			'A title must be provided for the recurring meeting',
			{
				invalidArgs: ['title']
			}
		);
	}

	if (!privacy || !['public', 'private'].includes(privacy)) {
		throw new UserInputError(
			'A valid privacy must be provided for the recurring meeting',
			{
				invalidArgs: ['privacy']
			}
		);
	}

	if (!frequency || frequency < 1) {
		throw new UserInputError('Frequency is not valid');
	}
	//Sunday - Saturday: 0 - 6
	if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 5) {
		throw new UserInputError('Day of week is not valid');
	}

	const recurringMeeting = await recurringMeetings.create({
		organizationId: org.id,
		title,
		description,
		start,
		end,
		dayOfWeek,
		frequency,
		privacy
	});

	// Add the recurring meeting to the google calendar
	let googleCalendar = await googleCalendars.orgIdLoader.load(org.id);

	if (!googleCalendar) {
		googleCalendar = await initOrgCalendar(org.id);
	}

	const gEventInfo = recurringMeetingGEventInfo({
		title,
		description,
		start,
		end,
		frequency,
		orgName: org.name,
		orgUrl: org.url
	});

	const googleEvent = await createCalendarEvent(
		googleCalendar.gCalId,
		gEventInfo
	);

	await googleCalendarEvents.create({
		googleCalendarId: googleCalendar.id,
		meetingId: recurringMeeting.id,
		gCalEventId: googleEvent.id,
		recurringMeeting: true
	});

	return meeting;
};
