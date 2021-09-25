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
							[Op.lt]: [start, end]
						}
					},
					{
						end: {
							[Op.between]: [start, end]
						}
					},
					{
						start: {
							[Op.lt]: start
						},
						end: { [Op.gt]: end }
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
