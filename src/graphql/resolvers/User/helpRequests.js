import { ForbiddenError } from 'apollo-server-errors';

export default async (user, args, { session, models: { helpRequests } }) => {
	session.authenticationRequired(['helpRequests']);

	const isAdmin = await session.adminRoleRequired(
		'helpRequests',
		['helpRequests'],
		true
	);

	if (request.userId !== session.userId && !isAdmin) {
		throw new ForbiddenError(
			'You are not allowed to access the helpRequests field of other users.'
		);
	}

	return await helpRequests.userIdLoader.load(session.userId);
};
