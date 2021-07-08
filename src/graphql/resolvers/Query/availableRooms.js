export default async (
	_,
	{ start, end },
	{
		models: {
			sequelize,
			rooms,
			meetings,
			meetingRooms,
			Sequelize: { Op }
		},
		authenticationRequired
	}
) => {
	authenticationRequired();

	const occupiedRooms = await meetingRooms.findAll({
		attributes: ['roomId'],
		include: {
			model: meetings,
			where: {
				[Op.or]: [
					{
						start: {
							[Op.between]: [start, end]
						}
					},
					{
						end: {
							[Op.between]: [start, end]
						}
					}
				]
			},
			required: true,
			attributes: []
		}
	});

	const occupiedRoomIds = occupiedRooms.map(i => i.roomId);

	return rooms.findAll({
		where: {
			id: {
				[Op.notIn]: occupiedRoomIds
			}
		}
	});
};
