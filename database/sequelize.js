const path = require('path');
const { SEQUELIZE_URL } = require('./../constants');

const logsEnabled = process.env.SEQUELIZE_LOG === 'true';

module.exports = {
	development: {
		url: SEQUELIZE_URL,
		define: {
			charset: 'utf8',
			collate: 'utf8_unicode_ci'
		},
		ssl: true,
		native: true,
		logging: logsEnabled ? console.log : false
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
		logging: false
	}
};
