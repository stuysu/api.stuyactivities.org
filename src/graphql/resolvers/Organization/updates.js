export default async (org, args, { session, models }) => {
	const mems = await session.getMemberships();

	const membership = mems.find(mem => mem.organizationId === org.id);

	let updates = await models.updates.orgIdLoader.load(org.id);

	if (!membership) {
		updates = updates.filter(update => {
			if (update.type === 'public' && update.approval === 'approved') {
				return true;
			}

			return membership.adminPrivileges;
		});
	}

	return updates;
};
