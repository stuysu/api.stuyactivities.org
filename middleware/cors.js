const cors = require('cors');
const { NODE_ENV } = require('./../constants');

const allowedOrigins = new RegExp(
	// This regex will match urls like
	// <http|https>://localhost:<port>
	// <http|https>://<optional: www/staging/api>.stuyactivities.org
	/^(http(s?):\/\/localhost((:\d{1,5})?))|(http(s?):\/\/(www\.)?(staging\.)?(api\.)?stuyactivities\.org)$/ // guardrails-disable-line
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

module.exports = cors(corsOptions);
