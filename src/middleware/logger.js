import { LOGGER_FORMAT } from '../constants.js';
const morgan = require('morgan');

const logger = morgan(LOGGER_FORMAT, {
	skip: (req, res) => res.statusCode < 400
});

export default logger;
