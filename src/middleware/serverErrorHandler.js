module.exports = (err, req, res, next) => {
	if (err.message === 'Not allowed by CORS') {
		res.end();
	} else {
		console.error(err);

		res.send(
			"There was an unexpected error. Don't worry we'll review this shortly."
		);
	}
};
