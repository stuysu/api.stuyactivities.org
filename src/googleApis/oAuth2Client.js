import { GOOGLE_APIS_CLIENT_ID, GOOGLE_APIS_CLIENT_SECRET } from '../constants';

const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
	GOOGLE_APIS_CLIENT_ID,
	GOOGLE_APIS_CLIENT_SECRET,
	'urn:ietf:wg:oauth:2.0:oob'
);

let token;

try {
	if (!process.env.CI) {
		// Check if we have previously stored a token.
		const savedToken = process.env.GOOGLE_APIS_TOKEN;
		token = JSON.parse(savedToken);
		oAuth2Client.setCredentials(token);
	}
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
		if (!token || !token.id_token) {
			return null;
		}

		const ticket = await oAuth2Client.verifyIdToken({
			idToken: token.id_token,
			audience: GOOGLE_APIS_CLIENT_ID
		});

		oAuthId = ticket.getPayload();
	}
	return oAuthId;
};

let accessToken = oAuth2Client.credentials.access_token;

// This function will just call the calendar api once per minute in order to keep our access token fresh
const fakeApiCall = async () => {
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
	await calendar.events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime'
	});

	if (accessToken !== oAuth2Client.credentials.access_token) {
		console.log('Access token has been refreshed ' + new Date());
		accessToken = oAuth2Client.credentials.access_token;
	}
};

fakeApiCall();

// Every minute check if the token needs to be refreshed
let refreshInterval;
if (!process.env.CI) {
	refreshInterval = setInterval(fakeApiCall, 1000 * 60);
}

export default oAuth2Client;
