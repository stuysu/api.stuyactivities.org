export default async (org, args, { user, signedIn }) => {
	if (!signedIn) {
		return null;
	}

	const memberships = user.memberships;
	return memberships.find(mem => mem.organizationId === org.id);
};
