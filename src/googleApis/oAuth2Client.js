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

export const refreshOAuth2Token = async (force = false) => {
	const now = new Date();
	const expires = new Date(oAuth2Client.credentials.expiry_date);

	const thirtyMinutes = 1000 * 60 * 30;
	const diff = expires.getTime() - now.getTime();

	if (diff < thirtyMinutes || force) {
		await oAuth2Client.getRequestHeaders();
	}
};

// Every minute check if the token needs to be refreshed
let refreshInterval;
if (!process.env.CI) {
	refreshInterval = setInterval(refreshOAuth2Token, 1000 * 60);
}

export default oAuth2Client;

process.stdin.resume();
// In the case that this process suddenly stops
// This will make sure to back up unsent emails to a file before closing the app
// This ruins the anonymity of matches a bit, but the file will be loaded in and deleted the next time the app runs
let backedUp = false;
const exitHandler = () => {
	if (!backedUp && oAuth2Client.credentials) {
		backedUp = true;
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
		console.log('Backing up last used token');
		fs.writeFileSync(
			path.resolve(__dirname, './token.json'),
			JSON.stringify(oAuth2Client.credentials)
		);
	}
	process.exit();
};

process.on(`exit`, exitHandler);
process.on(`SIGINT`, exitHandler);
process.on(`SIGUSR1`, exitHandler);
process.on(`SIGUSR2`, exitHandler);

process.on('uncaughtException', function (error) {
	console.log(error);
	exitHandler();
});
