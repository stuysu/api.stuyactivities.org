import morgan from 'morgan';
import { LOGGER_FORMAT } from '../constants';

const logger = morgan(LOGGER_FORMAT, {
	skip: (req, res) => res.statusCode < 400
});

export default logger;
