const expressSession = require('express-session');
const SequelizeConnectSession = require('connect-session-sequelize')(
	expressSession.Store
);
const db = require('../database').sequelize;

const sequelizeStore = new SequelizeConnectSession({ db });
const { SESSION_SECRET } = require('../constants');

const sessionOptions = {
	secret: SESSION_SECRET,
	name: 'session',
	resave: true,
	saveUninitialized: false,
	store: sequelizeStore,
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 7 * 86400 * 1000
	},
	rolling: true
};

if (process.env.NODE_ENV === 'production') {
	sessionOptions.cookie.secure = true;
	sessionOptions.cookie.sameSite = 'none';
}

const session = expressSession(sessionOptions);

sequelizeStore.sync();

module.exports = session;
