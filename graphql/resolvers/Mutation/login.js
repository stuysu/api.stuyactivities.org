const { ApolloError, UserInputError } = require('apollo-server-express');
const { users } = require('./../../../database');
const bcrypt = require('bcrypt');
const loginWithGoogle = require('./helpers/loginWithGoogle');

module.exports = async (root, params, context) => {
	if (context.session.signedIn) {
		throw new ApolloError(
			'You are already signed in.',
			'ALREADY_SIGNED_IN'
		);
	}

	// throw new Error('sign in failed');
	const googleToken = params.googleToken;
	const credentials = params.credentials;

	if (!googleToken && !credentials) {
		throw new UserInputError(
			'Credentials or an OAuth token must be provided with the request',
			{
				invalidArgs: ['credentials', 'googleToken']
			}
		);
	}

	if (googleToken) {
		// The code for authenticating with google is just far too long
		// Move it to its own helper module
		return await loginWithGoogle(googleToken, context.session);
	}

	if (credentials) {
		const incorrectError = new ApolloError(
			'Those credentials are invalid. ' +
				'Try signing in with one of the platforms or resetting your password if this continues.',
			'INVALID_CREDENTIALS'
		);
		const { email, password } = credentials;
		const user = await users.findOne({
			where: { email }
		});

		if (!user) {
			throw incorrectError;
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			throw incorrectError;
		}

		context.session.signedIn = true;
		context.session.userId = user.id;

		return user;
	}

	// We should never reach this statement but it is here as a failsafe
	throw new Error('Unknown authentication error');
};
