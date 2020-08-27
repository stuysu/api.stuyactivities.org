import nodemailer from 'nodemailer';
import oAuth2Client, { getOAuthId } from '../googleApis/oAuth2Client';

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
					accessToken: oAuth2Client.credentials.access_token
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
