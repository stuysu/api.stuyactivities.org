require('dotenv').config();
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

try {
	// Check if we have previously stored a token.
	const savedToken = fs.readFileSync(tokenPath).toString();
	oAuth2Client.setCredentials(JSON.parse(savedToken));
} catch (e) {
	throw new Error(
		"You haven't yet authenticated with google. Do that first by running: npm run authenticate"
	);
}

export default oAuth2Client;
