import nodemailer from 'nodemailer';
import oAuth2Client, { getOAuthId } from '../googleApis/oAuth2Client';
import { GOOGLE_APIS_CLIENT_ID, GOOGLE_APIS_CLIENT_SECRET } from '../constants';

let transport;

const sendMail = async data => {
	const user = await getOAuthId();
	if (!transport) {
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
	}

	return transport.sendMail(data);
};

const mailer = { sendMail };

export default mailer;
