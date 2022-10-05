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
					},
					{
						[Op.and]: [
							{
								start: {
									[Op.lt]: start
								}
							},
							{ end: { [Op.gt]: end } }
						]
					}
				]
			},
			required: true,
			attributes: []
		}
	});

	const occupiedRoomIds = occupiedRooms.map(i => i.roomId);

  const isSUAdmin = hasAdminRole('meetings');

	return rooms.findAll({
		where: {
      [Op.and]: [
        {
          id: {
            [Op.notIn]: occupiedRoomIds
          }
        },
        {
          [Op.or]: [
            {isSUAdmin},
            {approvalRequired: false}
          ]
        }
      ]
		}
	});
};
