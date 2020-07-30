require('dotenv').config();
const cluster = require('cluster');
const port = Number(process.env.PORT) || 3001;
const app = require('./app');

if (process.env.NODE_ENV === 'production') {
	if (cluster.isMaster) {
		console.log(
			'Running production server. Now Spawning worker processes...'
		);

		const cpuCount = require('os').cpus().length;

		// Create a worker for each CPU
		for (let i = 0; i < cpuCount; i += 1) {
			cluster.fork();
		}

		cluster.on('exit', worker => {
			// Restart the dead process
			console.log(`Worker ${worker.id} died. Restarting...`);
			cluster.fork();
		});
	} else {
		// Code to run inside of a worker
		app.listen(port, () =>
			console.log(`Worker ${cluster.worker.id} listening on port ${port}`)
		);
	}
} else {
	// Code to run in a development env
	app.listen(port, () => console.log(`Listening on port ${port}`));
}
