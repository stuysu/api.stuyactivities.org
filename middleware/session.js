const expressSession = require('express-session');
const SequelizeConnectSession = require('connect-session-sequelize')(
	expressSession.Store
);
const db = require('./../database').sequelize;

const sequelizeStore = new SequelizeConnectSession({ db });
const { SESSION_SECRET } = require('./../constants');

const session = expressSession({
	secret: SESSION_SECRET,
	name: 'session',
	resave: true,
	saveUninitialized: false,
	store: sequelizeStore,
	cookie: {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: 7 * 86400 * 1000,
		sameSite: 'none'
	},
	rolling: true
});

sequelizeStore.sync();

module.exports = session;
