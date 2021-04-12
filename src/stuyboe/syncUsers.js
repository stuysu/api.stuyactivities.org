import { verify, sign } from 'jsonwebtoken';

const axios = require('axios').default;
const models = require('./../database/models');

const query = JSON.stringify({
	query: `{
    publicKey {
        key
        expiration
    }
}`,
	variables: {}
});

const config = {
	method: 'post',
	url: 'https://vote.stuysu.org/api/graphql',
	headers: {
		'Content-Type': 'application/json'
	},
	data: query
};

export default async (req, res) => {
	let jwt = req.headers.authorization;

	if (!jwt) {
		return res.status(401).json({
			success: false,
			error: 'An authentication jwt must be provided to use this endpoint'
		});
	}

	if (jwt.includes('Bearer ')) {
		jwt = jwt.replace('Bearer ', '');
	}

	try {
		const { data } = await axios(config);
		const keyData = data.data.publicKey;

		const now = new Date();
		const expiration = new Date(keyData.publicKey);

		if (expiration < now) {
			throw new Error('The public key is expired for some reason');
		}

		// Verify the jwt that the user provided now
		const payload = await verify(jwt, keyData.key);

		if (!payload.user.adminPrivileges) {
			throw new Error('Not allowed to access this endpoint');
		}

		// Now validation is complete and we can actually allow the transfer of data
		const users = await models.users.findAll({
			attributes: [
				'firstName',
				'lastName',
				'email',
				'gradYear',
				'active',
				'isFaculty'
			]
		});

		res.json({
			success: true,
			data: users
		});
	} catch (e) {
		res.json({
			success: false,
			error: 'There was an issue validating the authentication token'
		});
	}
};
