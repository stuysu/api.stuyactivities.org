export default (
	root,
	{ limit, offset },
	{ authenticationRequired, models }
) => {
	authenticationRequired();
	return models.updates.findAll({
		where: {
			type: 'public',
			approval: 'approved'
		},
		order: [['createdAt', 'desc']],
		limit,
		offset
	});
};
