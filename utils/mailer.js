const nodemailer = require('nodemailer');
const { NODEMAILER_URL } = require('./../constants');

let transporter;

if (NODEMAILER_URL) {
	transporter = nodemailer.createTransport(NODEMAILER_URL);
}

module.exports = transporter;
