import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { Op } from 'sequelize';

export default async (
	_,
	{ roomId, meetingId },
	{ models, orgAdminRequired }
) => {
	const meeting = await models.meetings.findOne({ where: { id: meetingId } });

	if (!meeting) {
		throw new UserInputError('There is no meeting with that id');
	}

	orgAdminRequired(meeting.organizationId);

	const existingRooms = await models.meetingRooms.findAll({
		where: { meetingId }
	});

	if (existingRooms.length) {
		throw new ForbiddenError(
			'At this time only one room can be added to a meeting at any given time.'
		);
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
