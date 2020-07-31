const path = require('path');

const sqlitePath = path.resolve(__dirname, 'app.db');

const EDITABLE_CHARTER_FIELDS = [
	'picture',
	'purpose',
	'mission',
	'benefit',
	'appointmentProcedures',
	'uniqueness',
	'meetingSchedule',
	'meetingDays',
	'meetingFrequency',
	'commitmentLevel',
	'extra',
	'keywords'
];

export const PUBLIC_URL =
	process.env.PUBLIC_URL || 'https://stuyactivities.org';

module.exports = {
	PUBLIC_URL: process.env.PUBLIC_URL || 'https://stuyactivities.org',
	HONEYBADGER_KEY: process.env.HONEYBADGER_KEY || '',
	SEQUELIZE_URL:
		process.env.SEQUELIZE_URL ||
		process.env.DATABASE_URL ||
		`sqlite::${sqlitePath}`,
	NODE_ENV: process.env.NODE_ENV,
	SESSION_SECRET: process.env.SESSION_SECRET || 'some-temporary-secret',
	LOGGER_FORMAT: process.env.LOGGER_FORMAT || 'dev',
	NODEMAILER_URL: process.env.NODEMAILER_URL || '',
	GOOGLE_CLIENT_ID:
		process.env.GOOGLE_CLIENT_ID ||
		`250174499771-q7m4aptq02nlbo1u8tvqvg0jsckasmnp.apps.googleusercontent.com`,
	EDITABLE_CHARTER_FIELDS
};
