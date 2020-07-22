const { ForbiddenError } = require('apollo-server-express');

module.exports = (user, args, context) => {
	context.session.authenticationRequired(['hasPassword']);

	if (context.session.userId !== user.id) {
		throw new ForbiddenError(
			'The hasPassword field is only available for the user that is signed in.'
		);
	}

	return Boolean(user.password);
};
