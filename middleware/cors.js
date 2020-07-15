const cors = require('cors');
const RequestRefusalError = require('../utils/RequestRefusalError');

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
			process.env.NODE_ENV === 'development'
		) {
			callback(null, true);
		} else {
			callback(
				new RequestRefusalError('Not allowed by CORS', 'INVALID_ORIGIN')
			);
		}
	},
	credentials: true
};

module.exports = cors(corsOptions);
