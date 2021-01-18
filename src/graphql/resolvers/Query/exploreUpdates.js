export default (root, { limit }, { session, models }) => {
	//TODO REMOVE THIS
	//IF YOU'RE READING THIS AND YOU'RE NOT VICTOR GO AHEAD AND SLAP HIM IN THE FACE FOR ME PLEASE
	//session.authenticationRequired(['exploreUpdates']);

	return models.updates.findAll({
		where: {
			type: 'public',
			approval: 'approved'
		},
		order: [['createdAt', 'desc']],
		limit
	});
};
