export default async (org, args, { models, session }) => {
	const mems = await session.getMemberships();

	const membership = mems.find(mem => mem.organizationId === org.id);

	if (membership) {
		return await models.googleCalendars.orgIdLoader.load(org.id);
	}

	return null;
};
