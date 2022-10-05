import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { Op } from 'sequelize';

export default async (
	_,
	{ roomId, meetingId },
	{ models, isOrgAdmin, hasAdminRole }
) => {
	const meeting = await models.meetings.findOne({ where: { id: meetingId } });

	if (!meeting) {
		throw new UserInputError('There is no meeting with that id');
	}

	//If roomId is 0, the meeting is virtual,
	//so nothing should be done on the backend
	if (roomId === 0) {
		return meeting;
	}

  const orgAdmin = isOrgAdmin(meeting.organizationid);
  const isSUAdmin = hasAdminRole('meetings');
	if(!orgAdmin && !isSUAdmin){
    throw new ForbiddenError(
      "You don't have the necessary permissions to perform that query"
    );
  }

	const existingRooms = await models.meetingRooms.findAll({
		where: { meetingId }
	});

	if (existingRooms.length) {
		throw new ForbiddenError(
			'At this time only one room can be added to a meeting at any given time.'
		);
	}

  const room = await models.rooms.findOne({ where: { id: roomId } });
  
	if (!room) {
		throw new UserInputError('There is no room with that id');
	}

  if (room.approvalRequired && !isSUAdmin){
    throw new ForbiddenError('This room needs prior approval to book, contact it@stuysu.org');
  }

	const overlappingMeetings = await models.meetingRooms.findAll({
		where: {
			roomId
		},
		include: {
			model: models.meetings,
			where: {
				[Op.or]: [
					{
						start: {
							[Op.between]: [meeting.start, meeting.end]
						}
					},
					{
						end: {
							[Op.between]: [meeting.start, meeting.end]
						}
					}
				]
			},
			required: true
		}
	});

	if (overlappingMeetings.length) {
		throw new UserInputError(
			'That room is not available during the time of your meeting'
		);
	}

	await models.meetingRooms.create({
		meetingId,
		roomId
	});

	return meeting;
};
