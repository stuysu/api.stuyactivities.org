import nodemailer from 'nodemailer';
import oAuth2Client, { getOAuthId } from '../googleApis/oAuth2Client';
import emailRenderer from './emailRenderer';
import { parse } from 'node-html-parser';

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
				accessToken: oAuth2Client.credentials.access_token
			}
		},
		{
			from: `${user.name} <${user.email}>`
		}
	);

	transporter.set('oauth2_provision_cb', (user, renew, callback) => {
		return callback(null, oAuth2Client.credentials.access_token);
	});

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
