const { AuthenticationError } = require('apollo-server-express');

module.exports = (req, res, next) => {
	req.session.authenticationRequired = fields => {
		let message =
			'You must be signed in to access one or more requested fields';

		if (fields) {
			message =
				'You must be signed in to access the fields: ' +
				fields.join(', ');
		}

		throw new AuthenticationError(message);
	};

	next();
};
