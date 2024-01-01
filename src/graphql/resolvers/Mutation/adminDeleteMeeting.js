import { ApolloError } from 'apollo-server-errors';
import { deleteCalendarEvent } from '../../../googleApis/calendar';
import sendEmail from '../../../utils/sendEmail';
import { Op } from 'sequelize';
import moment from 'moment-timezone';

export default async (
	root,
	{ meetingId },
	{
		adminRoleRequired,
		models: {
			meetings,
			googleCalendarEvents,
			googleCalendars,
			memberships,
			organizations,
			users
		}
	}
) => {
	const meeting = await meetings.idLoader.load(meetingId);

	if (!meeting) {
		throw new ApolloError(
			"There's no meeting with that id",
			'MEETING_NOT_FOUND'
		);
	}

	adminRoleRequired('charters');

	const org = await organizations.idLoader.load(meeting.organizationId);

	let where = {};
	let include = {
		model: memberships,
		where: {
			organizationId: org.id,
			updateNotification: {
				[Op.not]: false
			}
		},
		required: true
	};

	const formattedStart = moment(meeting.start)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	const formattedEnd = moment(meeting.end)
		.tz('America/New_York')
		.format('dddd, MMMM Do YYYY, h:mm a');

	let members = await users.findAll({
		where,
		include
	});

	await Promise.all(
		members.map(async member => {
			await sendEmail({
				to: member.email,
				subject: `${org.name}'s meeting has been cancelled | StuyActivities`,
				template: 'adminDeleteMeeting.html',
				variables: {
					member,
					org,
					meeting,
					formattedStart,
					formattedEnd,
					renderedDescription: meeting.description
				}
			});
		})
	);

	const meetingCalEvent = await googleCalendarEvents.findOne({
		where: {
			meetingId: meetingId,
			recurringMeeting: false
		}
	});

	const gCal = await googleCalendars.orgIdLoader.load(meeting.organizationId);

	if (meetingCalEvent) {
		await deleteCalendarEvent(gCal.gCalId, meetingCalEvent.gCalEventId);
		await meetingCalEvent.destroy();
	}

	await meeting.destroy();

	return true;
};
