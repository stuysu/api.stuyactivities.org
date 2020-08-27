import { GOOGLE_APIS_CLIENT_ID, GOOGLE_APIS_CLIENT_SECRET } from '../constants';
import fs from 'fs';
import path from 'path';

const { google } = require('googleapis');

const tokenPath = path.resolve(__dirname, 'token.json');

const oAuth2Client = new google.auth.OAuth2(
	GOOGLE_APIS_CLIENT_ID,
	GOOGLE_APIS_CLIENT_SECRET,
	'urn:ietf:wg:oauth:2.0:oob'
);

let token;

try {
	// Check if we have previously stored a token.
	const savedToken = fs.readFileSync(tokenPath).toString();
	token = JSON.parse(savedToken);
	oAuth2Client.setCredentials(token);
} catch (e) {
	if (process.env.CI) {
		console.log(
			"Ignoring the fact that authentication hasn't been completed because app is running in CI mode"
		);
	} else {
		throw new Error(
			"You haven't yet authenticated with google. Do that first by running: npm run authenticate"
		);
	}
}

let oAuthId;

export const getOAuthId = async () => {
	if (!oAuthId) {
		const ticket = await oAuth2Client.verifyIdToken({
			idToken: token.id_token,
			audience: GOOGLE_APIS_CLIENT_ID
		});

		oAuthId = ticket.getPayload();
	}
	return oAuthId;
};

export default oAuth2Client;
