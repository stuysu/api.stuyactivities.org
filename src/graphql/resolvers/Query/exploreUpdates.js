export default (root, args, { session, models }) => {
	return models.updates.findAll({
		where: {
			type: 'public',
			approval: 'approved'
		},
		order: [['createdAt', 'desc']]
	});
};
