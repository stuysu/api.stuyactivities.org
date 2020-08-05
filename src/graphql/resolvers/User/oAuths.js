import { ForbiddenError } from 'apollo-server-express';

export default async (user, args, { models: { oAuthIds }, session }) => {
	session.authenticationRequired(['oAuths']);

	if (session.userId !== user.id) {
		throw new ForbiddenError(
			'You are only allowed to see your own oAuth identities.'
		);
	}

	return await oAuthIds.userIdLoader.load(session.userId);
};
