const {
	ForbiddenError,
	AuthenticationError
} = require('apollo-server-express');

module.exports = (user, args, context) => {
	if (!context.session.signedIn) {
		throw new AuthenticationError(
			'You must be signed in to request the hasPassword field.'
		);
	}

	if (context.session.userId !== user.id) {
		throw new ForbiddenError(
			'The hasPassword field is only available for the user that is signed in.'
		);
	}

	return Boolean(user.password);
};
