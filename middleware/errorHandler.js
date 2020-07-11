const reportError = require('../utils/reportError');

const errorHandler = (err, req, res, next) => {
	reportError(err, {
		session: req.session,
		url: req.path
	});

	res.json({
		success: false,
		error: {
			code: 'SERVER_ERROR',
			message: 'There was an unexpected error. Try again later.'
		}
	});
};

module.exports = errorHandler;
