const morgan = require('morgan');
const { LOGGER_FORMAT } = require('./../constants');

const logger = morgan(LOGGER_FORMAT, {
	skip: (req, res) => res.statusCode < 400
});

module.exports = logger;
