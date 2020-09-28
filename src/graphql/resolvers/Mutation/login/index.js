import { ApolloError, UserInputError } from 'apollo-server-express';
import loginWithGoogle from './loginWithGoogle';
import loginWithMagicToken from './loginWithMagicToken';

const { users } = require('../../../../database');

export default (root, params, context) => {
	const {
		models: { users },
		session
	} = context;

	if (session.signedIn) {
		throw new ApolloError(
			'You are already signed in.',
			'ALREADY_SIGNED_IN'
		);
	}

	// throw new Error('sign in failed');
	const { googleToken, loginToken } = params;

	if (!googleToken && !loginToken) {
		throw new UserInputError(
			'A login token or an OAuth token must be provided with the request',
			{
				invalidArgs: ['loginToken', 'googleToken']
			}
		);
	}

	if (googleToken) {
		// The code for authenticating with google is just far too long
		// Move it to its own helper module
		return loginWithGoogle(googleToken, session);
	}

	if (loginToken) {
		return loginWithMagicToken(loginToken, session);
	}
};
