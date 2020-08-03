import path from 'path';

const sqlitePath = path.resolve(__dirname, 'app.db');

export const EDITABLE_CHARTER_FIELDS = [
	'picture',
	'purpose',
	'mission',
	'benefit',
	'appointmentProcedures',
	'uniqueness',
	'meetingSchedule',
	'meetingDays',
	'commitmentLevel',
	'extra',
	'keywords'
];

export const PUBLIC_URL =
	process.env.PUBLIC_URL || 'https://stuyactivities.org';

export const HONEYBADGER_KEY = process.env.HONEYBADGER_KEY || '';

export const SEQUELIZE_URL =
	process.env.SEQUELIZE_URL ||
	process.env.DATABASE_URL ||
	`sqlite::${sqlitePath}`;

export const NODE_ENV = process.env.NODE_ENV;

export const SESSION_SECRET =
	process.env.SESSION_SECRET || 'some-temporary-secret';

export const LOGGER_FORMAT = process.env.LOGGER_FORMAT || 'combined';
export const NODEMAILER_URL = process.env.NODEMAILER_URL || '';

export const GOOGLE_CLIENT_ID =
	process.env.GOOGLE_CLIENT_ID ||
	`250174499771-q7m4aptq02nlbo1u8tvqvg0jsckasmnp.apps.googleusercontent.com`;
