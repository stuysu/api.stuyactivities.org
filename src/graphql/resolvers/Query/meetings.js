export default (
	root,
	{ start, end, limit },
	{
		models: {
			meetings,
			Sequelize: {
				Op: { gte, lte }
			}
		}
	}
) =>
	meetings.findAll({
		where: {
			start: {
				[gte]: start
			},
			end: {
				[lte]: end
			}
		},
		limit
	});
