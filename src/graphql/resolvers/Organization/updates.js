export default async (org, args, { signedIn, models, user }) => {
	if (!signedIn) {
		return [];
	}

	const mems = await user.memberships;

	const membership = mems.find(mem => mem.organizationId === org.id);

	let updates = await models.updates.orgIdLoader.load(org.id);

	const isAdmin = membership && membership.adminPrivileges;
	updates = updates.filter(update => {
		if (update.type === 'public' && update.approval === 'approved') {
			return true;
		}

		return isAdmin;
	});

	updates.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

	return updates;
};
