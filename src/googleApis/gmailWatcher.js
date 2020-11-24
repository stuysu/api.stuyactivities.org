import { google } from 'googleapis';
import oAuth2Client, { getOAuthId } from './oAuth2Client';
import cryptoRandomString from 'crypto-random-string';

const MailComposer = require('nodemailer/lib/mail-composer');
const { users, loginTokens } = require('./../database');
const parser = require('mailparser').simpleParser;
const GmailApi = new google.gmail({ version: 'v1', auth: oAuth2Client });

const getUnreadEmails = async () => {
	const response = await GmailApi.users.messages.list({
		userId: 'me',
		labelIds: ['UNREAD']
	});

	if (response.data.resultSizeEstimate) {
		return response.data.messages;
	}

	return [];
};

const getEmail = async id => {
	const response = await GmailApi.users.messages.get({
		userId: 'me',
		id,
		format: 'raw'
	});

	return await parser(Buffer.from(response.data.raw, 'base64').toString());
};

const markEmailAsRead = async id => {
	const response = await GmailApi.users.messages.modify({
		userId: 'me',
		id,
		resource: {
			removeLabelIds: ['UNREAD']
		}
	});

	return response.data;
};

const interval = 3000;

const routine = async () => {
	const emails = await getUnreadEmails();
	const oAuthUser = await getOAuthId();

	for (let i = 0; i < emails.length; i++) {
		const { id, threadId } = emails[i];
		const email = await getEmail(id);
		await markEmailAsRead(id);

		const isLoginEmail = email.subject.toLowerCase().includes('login');

		if (!isLoginEmail) {
			continue;
		}

		const sender = email.from.value[0].address;

		if (sender === oAuthUser.email) {
			continue;
		}

		const stuyactivitiesUser = await users.findOne({
			where: { email: sender }
		});

		const mailOptions = {
			from: oAuthUser.email,
			to: sender,
			inReplyTo: email.messageId,
			references: [email.messageId],
			subject: `Re: ${email.subject}`
		};

		if (!stuyactivitiesUser) {
			mailOptions.text =
				'There is no user with this email address on StuyActivities.';
		} else if (!stuyactivitiesUser.isFaculty) {
			mailOptions.text =
				'At this time only faculty are allowed to use this feature.';
		} else {
			const tokenString = cryptoRandomString({
				length: 128,
				type: 'url-safe'
			});

			await loginTokens.create({
				userId: stuyactivitiesUser.id,
				used: false,
				token: tokenString
			});

			mailOptions.text = `As per your request here is your login link to sign into StuyActivities. Paste it into your browser and you'll be automatically signed in. We highly recommend connecting your StuyActivities account to a Google account so future logins can happen more smoothly. \n\nhttps://stuyactivities.org/token/${tokenString}`;
		}

		const newEmail = await new MailComposer(mailOptions).compile().build();
		const raw = newEmail.toString('base64');

		await GmailApi.users.messages.send({
			userId: 'me',
			raw,
			threadId
		});
	}

	setTimeout(routine, interval);
};

if (!process.env.CI) {
	setTimeout(routine, interval);
}
