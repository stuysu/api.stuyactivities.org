const honeybadger = require('honeybadger');
const { HONEYBADGER_KEY } = require('./../constants');

if (HONEYBADGER_KEY) {
	honeybadger.configure({
		apiKey: HONEYBADGER_KEY
	});
}

module.exports = honeybadger;
