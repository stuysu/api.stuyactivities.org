import { ApolloError, ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ requestId },
	{ session, models: { helpRequests } }
) => {
	session.authenticationRequired(['closeHelpRequest']);

	const request = await helpRequests.idLoader.load(requestId);

	if (!request) {
		throw new ApolloError(
			'There is no help request with that id.',
			'ID_NOT_FOUND'
		);
	}

	const isAdmin = await session.adminRoleRequired(
		'helpRequests',
		['closeHelpRequest'],
		true
	);

	if (request.userId !== session.userId && !isAdmin) {
		throw new ForbiddenError('You are not allowed to close this request');
	}

	request.status = 'closed';
	await request.save();
	return request;
};
