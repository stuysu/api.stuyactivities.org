export default async (
	root,
	{ userId },
	{
		models: {
			meetings,
			groups,
			groupMemberships,
			Sequelize: { Op }
		},
		authenticationRequired
	}
) => {
	authenticationRequired();

	const now = new Date();

	return meetings.findAll({
		where: {
			end: {
				[Op.gte]: now
			},
			[Op.or]: {
				groupId: 0,
				'$group.name$': { [Op.like]: '%' }
			}
		},
		include: {
			as: 'group',
			model: groups,
			required: false,
			include: {
				model: groupMemberships,
				where: {
					userId
				},
				required: true
			}
		},
		order: [['start', 'asc']]
	});
};
