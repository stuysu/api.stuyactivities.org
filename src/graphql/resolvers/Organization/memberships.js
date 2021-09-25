export default async (org, params, { models }) => {
	if (!params.onlyLeaders) {
		return models.memberships.orgIdLoader.load(org.id);
	}

	const memberships = await models.memberships.orgIdLoader.load(org.id);

	return memberships.filter(mem => mem.adminPrivileges);
};
