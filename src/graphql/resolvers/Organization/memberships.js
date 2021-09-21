export default async (org, params, { models }) => {
	if (!params.onlyLeaders) {
		return models.memberships.orgIdLoader.load(
			org.id,
			{},
			{ order: [['adminPrivileges', 'DESC']] }
		);
	}

	return models.memberships.orgIdLoader.load(org.id, { adminPrivileges: 1 });
};
