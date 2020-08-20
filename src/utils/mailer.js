import nodemailer from 'nodemailer';
import { NODEMAILER_URL } from '../constants';

let mailer;

if (NODEMAILER_URL) {
	mailer = nodemailer.createTransport(NODEMAILER_URL);
} else {
	mailer = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: 'au44dhwqby6zyzed@ethereal.email', // generated ethereal user
			pass: 'u1adM6uebnhG4jSqEC' // generated ethereal password
		}
	});
}

export default mailer;
