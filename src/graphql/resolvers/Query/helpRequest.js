import { ApolloError, ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ requestId },
	{ models: { helpRequests }, authenticationRequired, hasAdminRole, user }
) => {
	authenticationRequired();
	const isAdmin = hasAdminRole('helpRequests');
	const request = await helpRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no help request with that id.',
			'ID_NOT_FOUND'
		);
	}

	if (!isAdmin && request.userId !== user.id) {
		throw new ForbiddenError(
			'You are not allowed to view this help request'
		);
	}

	return request;
};
