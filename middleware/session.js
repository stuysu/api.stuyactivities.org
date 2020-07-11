const expressSession = require('express-session');
const SequelizeConnectSession = require('connect-session-sequelize')(
	expressSession.Store
);
const db = require('./../database').sequelize;

const sequelizeStore = new SequelizeConnectSession({ db });

const sessionSecret =
	process.env.SESSION_SECRET || 'some_semi_permanent_secret';

const session = expressSession({
	secret: sessionSecret,
	name: 'session',
	resave: true,
	saveUninitialized: false,
	store: sequelizeStore,
	cookie: {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: 7 * 86400 * 1000
	},
	rolling: true
});

sequelizeStore.sync();

module.exports = session;
