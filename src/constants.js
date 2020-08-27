require('dotenv').config();
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

export const GOOGLE_LOGIN_CLIENT_ID =
	process.env.GOOGLE_LOGIN_CLIENT_ID ||
	`249789152860-ucok38v4tssc04o7epldvseiv3hevcq5.apps.googleusercontent.com`;

export const GOOGLE_APIS_CLIENT_ID =
	process.env.GOOGLE_APIS_CLIENT_ID ||
	'249789152860-12uce9nrsb6s0k582epuk92bbjsm8bm7.apps.googleusercontent.com';

export const GOOGLE_PROJECT_ID =
	process.env.GOOGLE_PROJECT_ID || 'stuyactivities-org';

export const GOOGLE_APIS_CLIENT_SECRET = process.env.GOOGLE_APIS_CLIENT_SECRET;
