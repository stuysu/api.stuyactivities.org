export default async (root, { limit, offset }, { session, models }) => {
	//TODO REMOVE THIS
	//IF YOU'RE READING THIS AND YOU'RE NOT VICTOR GO AHEAD AND SLAP HIM IN THE FACE FOR ME PLEASE
	//session.authenticationRequired(['exploreUpdates']);

	const results = await models.updates.findAll({
		where: {
			type: 'public',
			approval: 'approved'
		},
		order: [['createdAt', 'desc']]
	});

	if (limit) limit = limit + offset;
	return results.slice(offset, limit);
};
