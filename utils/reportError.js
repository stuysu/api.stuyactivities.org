const hb = require('honeybadger');
let reportError;

const apiKey = process.env.HONEYBADGER_KEY;
if (apiKey) {
	hb.configure({
		apiKey
	});

	reportError = hb.notify;
} else {
	reportError = console.error;
}

module.exports = reportError;
