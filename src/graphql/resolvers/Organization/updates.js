export default async (org, args, { session, models }) => {
	if (!session.signedIn) {
		return [];
	}

	const mems = await session.getMemberships();

	const membership = mems.find(mem => mem.organizationId === org.id);

	let updates = await models.updates.orgIdLoader.load(org.id);

	updates = updates.filter(update => {
		if (update.type === 'public' && update.approval === 'approved') {
			return true;
		}

		return membership?.adminPrivileges;
	});

	updates.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

	return updates;
};
