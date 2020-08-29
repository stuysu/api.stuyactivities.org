import nodemailer from 'nodemailer';
import oAuth2Client, { getOAuthId } from '../googleApis/oAuth2Client';
import emailRenderer from './emailRenderer';
import { parse } from 'node-html-parser';
import { GOOGLE_APIS_CLIENT_ID, GOOGLE_APIS_CLIENT_SECRET } from '../constants';

let transporter;

const transporterSetup = new Promise(async resolve => {
	const user = await getOAuthId();
	transporter = nodemailer.createTransport(
		{
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				type: 'OAuth2',
				user: user.email,
				clientId: GOOGLE_APIS_CLIENT_ID,
				clientSecret: GOOGLE_APIS_CLIENT_SECRET,
				accessToken: oAuth2Client.credentials.access_token,
				refreshToken: oAuth2Client.credentials.refresh_token
			}
		},
		{
			from: `${user.name} <${user.email}>`
		}
	);

	resolve();
});

export const getTransporter = async () => {
	await transporterSetup;
	return transporter;
};

const sendEmail = async ({ to, subject, template, variables, cc, bcc }) => {
	await transporterSetup;

	const html = emailRenderer.render(template, variables);
	const text = parse(html).structuredText;
	return transporter.sendMail({
		to,
		cc,
		bcc,
		subject,
		html,
		text
	});
};

export default sendEmail;
