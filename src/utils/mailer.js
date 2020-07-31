import nodemailer from 'nodemailer';
import { NODEMAILER_URL } from '../constants';

let mailer;

if (NODEMAILER_URL) {
	mailer = nodemailer.createTransport(NODEMAILER_URL);
}

export default mailer;
