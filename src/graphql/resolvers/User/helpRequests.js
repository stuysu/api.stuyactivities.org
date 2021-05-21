import { ForbiddenError } from 'apollo-server-errors';

export default async (
	user,
	args,
	{
		user: authenticatedUser,
		authenticationRequired,
		hasAdminRole,
		models: { helpRequests }
	}
) => {
	authenticationRequired();

	const isAdmin = hasAdminRole('helpRequests');

	if (user.id !== authenticatedUser.id && !isAdmin) {
		throw new ForbiddenError(
			'You are not allowed to view help requests belonging to other users'
		);
	}

	return await helpRequests.userIdLoader.load(user.id);
};
