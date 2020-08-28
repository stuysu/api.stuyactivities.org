import { ApolloError } from 'apollo-server-errors';
import { deleteCalendarEvent } from '../../../googleApis/calendar';

export default async (
	root,
	{ meetingId },
	{ session, models: { meetings, googleCalendarEvents, googleCalendars } }
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

	const meetingCalEvent = await googleCalendarEvents.meetingIdLoader.load(
		meeting.id
	);

	const gCal = await googleCalendars.orgIdLoader.load(meeting.organizationId);

	if (meetingCalEvent) {
		await deleteCalendarEvent(gCal.gCalId, meetingCalEvent.gCalEventId);
		await meetingCalEvent.destroy();
	}

	await meeting.destroy();

	return true;
};
