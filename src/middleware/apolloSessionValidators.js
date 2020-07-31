const { AuthenticationError } = require('apollo-server-express');

const apolloSessionValidators = (req, res, next) => {
	req.session.authenticationRequired = fields => {
		if (!req.session.signedIn) {
			let message =
				'You must be signed in to perform one or more parts of this request.';

			if (fields) {
				message =
					'You must be signed in to perform one or more parts of this request: ' +
					fields.join(', ');
			}

			throw new AuthenticationError(message);
		}
	};

	next();
};

export default apolloSessionValidators;
