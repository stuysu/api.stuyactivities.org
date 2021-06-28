export default async (org, args, { models, user, signedIn }) => {
	if (!signedIn) {
		return null;
	}

	const requests = await models.membershipRequests.userIdLoader.load(user.id);

	return requests.find(req => req.organizationId === org.id);
};
