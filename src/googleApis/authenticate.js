import { GOOGLE_APIS_CLIENT_ID, GOOGLE_APIS_CLIENT_SECRET } from '../constants';
import fs from 'fs';
import path from 'path';

const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = [
	'https://www.googleapis.com/auth/calendar https://mail.google.com/'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const tokenPath = path.resolve(__dirname, 'token.json');

export const oAuth2Client = new google.auth.OAuth2(
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
	oAuth2Client.getToken(code).then(res => {
		const token = res.tokens;
		fs.writeFileSync(tokenPath, JSON.stringify(token));
	});
});
