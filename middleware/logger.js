const morgan = require('morgan');

const logger = morgan(process.env.MORGAN_FORMAT || 'dev', {
	skip: (req, res) =>
		res.statusCode < 400 && process.env.NODE_ENV === 'production'
});

module.exports = logger;
