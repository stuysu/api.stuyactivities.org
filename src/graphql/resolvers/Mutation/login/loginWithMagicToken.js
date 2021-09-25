import { ApolloError } from 'apollo-server-express';
import { sign } from 'jsonwebtoken';

const { users, loginTokens, keyPairs } = require('../../../../database');

export default async function loginWithMagicToken({ token, setCookie }) {
	const row = await loginTokens.tokenLoader.load(token);

	if (!row || !row.isValid()) {
		throw new ApolloError(
			'That sign in link is not valid. Try requesting a new link.',
			'INVALID_TOKEN'
		);
	}

	row.used = true;
	await row.save();

	const user = await users.findOne({
		where: {
			id: row.userId
		}
	});

	const { privateKey, passphrase } = await keyPairs.getSigningKey();

	const { id, firstName, lastName, email } = user;

	const jwt = await sign(
		{
			user: {
				id,
				firstName,
				lastName,
				email
			}
		},
		{ key: privateKey, passphrase },
		{ algorithm: 'RS256', expiresIn: '30d' }
	);

	setCookie('auth-jwt', jwt, {
		maxAge: 1000 * 60 * 24 * 30,
		path: '/',
		httpOnly: true,
		sameSite: 'none',
		secure: true
	});

	return jwt;
}
