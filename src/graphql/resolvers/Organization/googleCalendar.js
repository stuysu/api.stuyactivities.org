export default async (org, args, { models, user }) => {
	const mems = user.memberships;

	const membership = mems.find(mem => mem.organizationId === org.id);

	if (membership) {
		return await models.googleCalendars.orgIdLoader.load(org.id);
	}

	return null;
};
