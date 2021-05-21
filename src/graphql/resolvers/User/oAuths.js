import { ForbiddenError } from 'apollo-server-express';

export default async (
	user,
	args,
	{ models: { oAuthIds }, user: authenticatedUser, authenticationRequired }
) => {
	authenticationRequired();

	if (authenticatedUser.id !== user.id) {
		throw new ForbiddenError(
			'You are only allowed to see your own oAuth identities.'
		);
	}

	return await oAuthIds.userIdLoader.load(authenticatedUser.id);
};
