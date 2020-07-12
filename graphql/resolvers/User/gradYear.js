const { AuthenticationError } = require('apollo-server-express');

module.exports = (user, args, context) => {
	if (!context.session.signedIn) {
		throw new AuthenticationError(
			'You must be signed in to access the graduation year field.'
		);
	}

	return user.gradYear;
};
