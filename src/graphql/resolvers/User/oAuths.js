import { ForbiddenError } from 'apollo-server-express';

export default async (user, args, { models, session }) => {
	context.session.authenticationRequired(['oAuths']);

	if (context.session.userId !== user.id) {
		throw new ForbiddenError(
			'You are only allowed to see your own oAuth identities.'
		);
	}

	return await models.oAuthIds.userIdLoader.load(session.userId);
};
