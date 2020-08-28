import { ApolloError } from 'apollo-server-errors';

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

	if (request.userId !== session.userId) {
		throw new ApolloError(
			'Only the person who created a request is allowed to delete it.'
		);
	}

	await request.destroy();

	return true;
};
