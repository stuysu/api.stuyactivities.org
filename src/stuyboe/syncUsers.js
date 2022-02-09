import { verify } from 'jsonwebtoken';
import { getTransporter } from '../utils/sendEmail';

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
		const expiration = new Date(keyData.publicKey.expiration);

		if (expiration < now) {
			throw new Error('The public key is expired for some reason');
		}

		// Verify the jwt that the user provided now
		const { user } = await verify(jwt, keyData.key);

		if (!user.adminPrivileges) {
			throw new Error('Not allowed to access this endpoint');
		}

		const transporter = await getTransporter();

		const time =
			new Date().toLocaleDateString() +
			' ' +
			new Date().toLocaleTimeString();

		transporter.sendMail({
			to: ['it@stuysu.org', user.email],
			subject:
				user.firstName +
				' Accessed The StuyBOE API Endpoint On StuyActivities',
			html: `<p>This is a confirmation to let you know that ${user.firstName} ${user.lastName} (${user.email}) used the api endpoint at https://api.stuyactivities.org/stuyboe/syncUsers on ${time}</p>
				<p>If this person is associated with the BOE or this activity appears normal, you may ignore this email. Otherwise reach out to the necessary party.</p>`
		});

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
