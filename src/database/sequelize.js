import { SEQUELIZE_URL } from '../constants';

const logging = process.env.SEQUELIZE_LOG === 'true' ? console.log : false;
module.exports = {
	development: {
		url: SEQUELIZE_URL,
		define: {
			charset: 'utf8',
			collate: 'utf8_unicode_ci'
		},
		ssl: true,
		native: true,
		logging
	},
	production: {
		url: SEQUELIZE_URL,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		define: {
			charset: 'utf8',
			collate: 'utf8_unicode_ci'
		},
		native: true,
		ssl: true,
		logging
	}
};
