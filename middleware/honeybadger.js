const honeybadger = require('honeybadger');

const apiKey = process.env.HONEYBADGER_KEY;

if (apiKey) {
	honeybadger.configure({
		apiKey
	});
}

module.exports = honeybadger;
