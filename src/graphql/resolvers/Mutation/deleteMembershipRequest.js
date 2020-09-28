import { ApolloError, ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ requestId },
	{ session, models: { membershipRequests } }
) => {
	session.authenticationRequired(['deleteMembershipRequest']);

	const request = await membershipRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no membership request with that id.',
			'ID_NOT_FOUND'
		);
	}

	const isAdmin = await session.orgAdminRequired(
		request.organizationId,
		['deleteMembershipRequest'],
		true
	);

	if (request.userId !== session.userId && !isAdmin) {
		throw new ForbiddenError(
			'Only the person who created a request or an admin of the associated club are allowed to delete it.'
		);
	}

	await request.destroy();

	return true;
};