import honeybadger from 'honeybadger';
import { HONEYBADGER_KEY } from '../constants';

if (HONEYBADGER_KEY) {
	honeybadger.configure({
		apiKey: HONEYBADGER_KEY
	});
}

export default honeybadger;
