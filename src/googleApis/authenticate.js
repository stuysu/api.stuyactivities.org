import { GOOGLE_APIS_CLIENT_ID, GOOGLE_APIS_CLIENT_SECRET } from '../constants';
import path from 'path';

const readline = require('readline');
const { google } = require('googleapis');
const { backgroundAccessTokens } = require('./../database');

const SCOPES = [
	'https://www.googleapis.com/auth/calendar https://mail.google.com/ email profile'
];

const oAuth2Client = new google.auth.OAuth2(
	GOOGLE_APIS_CLIENT_ID,
	GOOGLE_APIS_CLIENT_SECRET,
	'urn:ietf:wg:oauth:2.0:oob'
);

const authUrl = oAuth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: SCOPES
});

console.log('Authorize this app by visiting this url:', authUrl);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('Enter the code from that page here: ', code => {
	rl.close();
	oAuth2Client.getToken(code).then(async res => {
		const token = res.tokens;
		await backgroundAccessTokens.destroy({
			where: {
				service: 'google'
			}
		});

		await backgroundAccessTokens.create({
			service: 'google',
			token: JSON.stringify(token)
		});

		console.log('Authentication complete!');
	});
});
