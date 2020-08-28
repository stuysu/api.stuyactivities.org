import nodemailer from 'nodemailer';
import oAuth2Client, { getOAuthId } from '../googleApis/oAuth2Client';
import { GOOGLE_APIS_CLIENT_ID, GOOGLE_APIS_CLIENT_SECRET } from '../constants';
import emailRenderer from './emailRenderer';
import { parse } from 'node-html-parser';

let transport;

const transportSetup = new Promise(async resolve => {
	const user = await getOAuthId();
	transport = nodemailer.createTransport(
		{
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				type: 'OAuth2',
				user: user.email,
				accessToken: oAuth2Client.credentials.access_token,
				clientId: GOOGLE_APIS_CLIENT_ID,
				refreshToken: oAuth2Client.credentials.refresh_token,
				clientSecret: GOOGLE_APIS_CLIENT_SECRET
			}
		},
		{
			from: `${user.name} <${user.email}>`
		}
	);

	resolve();
});

export const getTransport = async () => {
	await transportSetup;
	return transport;
};

const sendEmail = async ({ to, subject, template, variables, cc, bcc }) => {
	await transportSetup;

	const html = emailRenderer.render(template, variables);
	const text = parse(html).structuredText;
	return transport.sendMail({
		to,
		cc,
		bcc,
		subject,
		html,
		text
	});
};

export default sendEmail;
