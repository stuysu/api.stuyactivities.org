import { UserInputError, ForbiddenError } from 'apollo-server-express';

export default async (
	_,
	{ roomId, meetingId },
	{ models, orgAdminRequired }
) => {
	const meeting = await models.meetings.findOne({ where: { id: meetingId } });

	if (!meeting) {
		throw new UserInputError('There is no meeting with that id');
	}

	//If roomId is 0, the meeting is virtual,
	//so nothing should be done on the backend
	if (!roomId) {
		return meeting;
	}

	orgAdminRequired(meeting.organizationId);

	// check if the room is actually added to the meeting already
	const roomBooking = await models.meetingRooms.findOne({
		where: { meetingId, roomId }
	});

	if (!roomBooking) {
		throw new UserInputError('That room is not attached to this meeting');
	}

	await roomBooking.destroy();

	return meeting;
};
