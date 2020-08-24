export default async (org, args, { models, session }) => {
	if (!session.signedIn) {
		return null;
	}

	const memberships = await models.memberships.userIdLoader(session.userId);
	return memberships.find(mem => mem.organizationId === org.id);
};
