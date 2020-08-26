export default async (org, args, { models, session }) => {
	if (!session.signedIn) {
		return null;
	}

	const requests = await models.membershipRequests.userIdLoader.load(
		session.userId
	);

	return requests.find(req => req.organizationId === org.id);
};
