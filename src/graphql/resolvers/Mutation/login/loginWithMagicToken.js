import { ApolloError } from 'apollo-server-express';
const { users, loginTokens } = require('../../../../database');

export default async function loginWithMagicToken(token, session) {
	const row = await loginTokens.tokenLoader.load(token);

	if (!row || !row.isValid()) {
		throw new ApolloError(
			'That sign in link is not valid. Try requesting a new link.',
			'INVALID_TOKEN'
		);
	}

	session.signedIn = true;
	session.userId = row.userId;

	return await users.idLoader.load(row.userId);
}
