import {
	GOOGLE_APIS_CLIENT_ID,
	GOOGLE_APIS_CLIENT_SECRET
} from '../constants.js'; // don't forget to set the secret!

import { google } from 'googleapis';
import { createServer } from 'http'; // built-in node HTTP webserver
import { backgroundAccessTokens } from './../database'; // corresponds to DB table

const SCOPES = [
	'https://www.googleapis.com/auth/calendar https://mail.google.com/ email profile'
];

const oAuth2Client = new google.auth.OAuth2(
	GOOGLE_APIS_CLIENT_ID,
	GOOGLE_APIS_CLIENT_SECRET,
	'http://localhost:3001'
);

const authUrl = oAuth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: SCOPES
});

console.log('Authorize this app by visiting this url:', authUrl);

// launch local HTTP server for Google OAuth redirect
createServer(function (req, res) {
	const params = new URLSearchParams(req.url.slice(2)); // URL parser
	if (params.has('code')) {
		// we got a callback from the OAuth flow
		oAuth2Client.getToken(params.get('code')).then(async ({ tokens }) => {
			// out with the old...
			await backgroundAccessTokens.destroy({
				where: {
					service: 'google'
				}
			});
			// in with the new!
			await backgroundAccessTokens.create({
				service: 'google',
				token: JSON.stringify(tokens)
			});

			console.log('Authentication complete! - Now you can run the API!');
			res.write('Authentication Complete!');
			res.end();
			process.exit(0);
		});
	} else {
		res.writeHead(200);
		res.write('StuyActivities API Authentication - Calendar and Email');
		res.end();
	}
}).listen(3001);
