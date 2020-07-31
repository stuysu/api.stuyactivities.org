import app from './../app';
import http from 'http';

describe('App', function () {
	describe('#listen', function () {
		it('should run a server without error', done => {
			const server = http.createServer(app);
			try {
				server.listen(process.env.PORT || 3001);
				done();
			} finally {
				server.close();
			}
		});
	});
});
