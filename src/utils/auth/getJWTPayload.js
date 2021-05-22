import { verify } from 'jsonwebtoken';

const { keyPairs } = require('./../../database/models');

export default async function getJWTPayload(jwt) {
	const keys = await keyPairs.getValidKeyPairs();

	// Typically this will only run through one iteration, but closer to the expiration (about 30 days) we'll have to check two keys
	for (let i = 0; i < keys.length; i++) {
		try {
			const data = await verify(jwt, keys[i].publicKey);

			return data;
		} catch (e) {}
	}

	return null;
}
