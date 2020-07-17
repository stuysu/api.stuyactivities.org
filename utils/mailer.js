const nodemailer = require('nodemailer');
const { NODEMAILER_URL } = require('./../constants');

let transporter;

if (NODEMAILER_URL) {
	transporter = nodemailer.createTransport(NODEMAILER_URL);
} else {
	nodemailer.createTestAccount().then(testAccount => {
		transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: testAccount.user, // generated ethereal user
				pass: testAccount.pass // generated ethereal password
			}
		});
	});
}

module.exports = transporter;
