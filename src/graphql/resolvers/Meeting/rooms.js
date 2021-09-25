export default (meeting, _, { models: { rooms } }) =>
	rooms.findAll({ where: { meetingId: meeting.id } });
