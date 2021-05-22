export default (
	_,
	{ start, end, organizationId },
	{ models: { meetings, Sequelize } }
) => {
	const where = {
		organizationId
	};

	if (start) {
		where.start = {
			[Sequelize.Op.gte]: start
		};
	}

	if (end) {
		where.end = {
			[Sequelize.Op.lte]: end
		};
	}

	return meetings.findAll({
		where,
		order: [
			['start', 'desc'],
			['end', 'desc'],
			['createdAt', 'desc'],
			['updatedAt', 'desc']
		]
	});
};
