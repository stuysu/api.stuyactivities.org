import nodemailer from 'nodemailer';
import oAuth2Client, { getOAuthId } from '../googleApis/oAuth2Client';
import emailRenderer from './emailRenderer';
import { parse } from 'node-html-parser';
import {
	GOOGLE_APIS_CLIENT_ID,
	GOOGLE_APIS_CLIENT_SECRET,
	MAILER_URL
} from '../constants';

let transporter;

const transporterSetup = new Promise(async resolve => {
	if (MAILER_URL) {
		transporter = nodemailer.createTransport(MAILER_URL, {
			from: 'StuyActivities App <app@stuyactivities.org>'
		});
	} else {
		let user = await getOAuthId();

		if (!user) {
			user = {
				email: 'app@stuyactivities.org',
				name: 'StuyActivities App'
			};
		}

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
	}
	resolve();
});

export const getTransporter = async () => {
	await transporterSetup;
	return transporter;
};

const sendEmail = async ({
	to,
	subject,
	template,
	variables,
	cc,
	bcc,
	replyTo
}) => {
	await transporterSetup;

	const html = emailRenderer.render(template, variables);
	const text = parse(html).structuredText;
	return transporter.sendMail({
		to,
		cc,
		bcc,
		subject,
		html,
		text,
		replyTo
	});
};

export default sendEmail;
