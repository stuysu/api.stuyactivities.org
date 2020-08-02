export default async (org, params, { models }) => {
	const memberships =
		org.memberships || (await models.memberships.orgIdLoader.load(org.id));

	if (params.onlyLeaders) {
		return memberships.filter(mem => mem.adminPrivileges);
	}

	return memberships;
};
