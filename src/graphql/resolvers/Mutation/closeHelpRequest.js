import { ApolloError, ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ requestId },
	{ authenticationRequired, user, models: { helpRequests }, hasAdminRole }
) => {
	authenticationRequired();

	const request = await helpRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no help request with that id.',
			'ID_NOT_FOUND'
		);
	}

	const isAdmin = hasAdminRole('helpRequests');

	if (request.userId !== user.id && !isAdmin) {
		throw new ForbiddenError('You are not allowed to close this request');
	}

	request.status = 'closed';
	await request.save();
	return request;
};
