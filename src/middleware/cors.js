import cors from 'cors';
import { NODE_ENV } from '../constants.js';

const allowedOrigins = new RegExp(
	process.env.ALLOWED_ORIGINS ||
		// This regex will match urls like
		// <http|https>://localhost:<port>
		// <http|https>://<optional: www|staging|api>.stuyactivities.org
		/^(http(s?):\/\/localhost((:\d{1,5})?))|(http(s?):\/\/(www\.)?(staging\.)?(beta\.)?(api\.)?stuyactivities\.org)|(https:\/\/(([a-zA-Z0-9-]){1,64}--)?(beta-)?stuyactivities\.netlify\.((com)|(app)))$/ // guardrails-disable-line
);

const corsOptions = {
	origin: (origin, callback) => {
		if (
			!origin ||
			origin.match(allowedOrigins) ||
			NODE_ENV === 'development'
		) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
};

export default cors(corsOptions);
