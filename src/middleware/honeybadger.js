import honeybadger from 'honeybadger';
import { HONEYBADGER_KEY } from '../constants.js';

if (HONEYBADGER_KEY) {
	honeybadger.configure({
		apiKey: HONEYBADGER_KEY
	});
}

export default honeybadger;
