import { ApolloError } from 'apollo-server-errors';
import { deleteCalendarEvent } from '../../../googleApis/calendar';
import destroyRecurringMeetingChildren from '../../../utils/destroyRecurringMeetingChildren';

export default async (
	root,
	{ recurringMeetingId },
	{
		session,
		models: {
			recurringMeetings,
			meetings,
			googleCalendarEvents,
			googleCalendars
		}
	}
) => {
	session.authenticationRequired(['createMeeting']);

	const recurringMeeting = await recurringMeetings.idLoader.load(
		recurringMeetingId
	);

	if (!meeting) {
		throw new ApolloError(
			"There's no recurring meeting with that id",
			'MEETING_NOT_FOUND'
		);
	}

	await session.orgAdminRequired(recurringMeeting.organizationId);

	/*const meetingCalEvent = await googleCalendarEvents.meetingIdLoader.load(
		meeting.id
	);*/
	const meetingCalEvent = await googleCalendarEvents.findOne({
		where: {
			meetingId: recurringMeetingId,
			recurringMeeting: true
		}
	});

	const gCal = await googleCalendars.orgIdLoader.load(meeting.organizationId);

	if (meetingCalEvent) {
		await deleteCalendarEvent(gCal.gCalId, meetingCalEvent.gCalEventId);
		await meetingCalEvent.destroy();
	}

	await destroyRecurringMeetingChildren({ recurringMeeting, meetings });

	await recurringMeeting.destroy();

	return true;
};
