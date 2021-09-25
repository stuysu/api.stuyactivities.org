export default async (meeting, _, { models: { rooms, meetingRooms } }) => {
	let reservations = await meetingRooms.findAll({
		where: { meetingId: meeting.id }
	});
	return rooms.findAll({ where: { id: reservations.map(r => r.roomId) } });
};
