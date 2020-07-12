const {
	ForbiddenError,
	AuthenticationError
} = require('apollo-server-express');
const { oAuthIds } = require('./../../../database');

module.exports = async (user, args, context) => {
	if (!context.session.signedIn) {
		throw new AuthenticationError(
			'You must be signed in to view linked oauth identities.'
		);
	}

	if (!context.session.userId !== user.id) {
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
