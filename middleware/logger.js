const morgan = require('morgan');

const logger = morgan(process.env.MORGAN_FORMAT || 'dev', {
	skip: (req, res) => res.statusCode < 400
});

module.exports = logger;
