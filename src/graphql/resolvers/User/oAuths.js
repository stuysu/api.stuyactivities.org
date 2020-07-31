import { ForbiddenError } from 'apollo-server-express';
const { oAuthIds } = require('../../../database');

export default async (user, args, context) => {
	context.session.authenticationRequired(['oAuths']);

	if (context.session.userId !== user.id) {
		throw new ForbiddenError(
			'You are only allowed to see your own oAuth identities.'
		);
	}

	return await oAuthIds.findAll({
		where: {
			userId: user.id
		}
	});
};
