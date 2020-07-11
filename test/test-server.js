const app = require('./../app');

describe('App', function () {
	describe('#listen', function () {
		it('should run a server without error', done => {
			let server;
			try {
				server = app.listen(process.env.PORT || 3001);
				done();
			} finally {
				server.close();
			}
		});
	});
});
