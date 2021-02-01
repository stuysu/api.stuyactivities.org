import expressSession from 'express-session';
import SequelizeConnectSessionConstructor from 'connect-session-sequelize';
import { SESSION_SECRET } from '../constants';

const SequelizeConnectSession = SequelizeConnectSessionConstructor(
	expressSession.Store
);

const db = require('../database').sequelize;

const sequelizeStore = new SequelizeConnectSession({ db });

const sessionOptions = {
	secret: SESSION_SECRET,
	name: 'session',
	resave: true,
	saveUninitialized: false,
	store: sequelizeStore,
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 7 * 86400 * 1000,
		sameSite: 'none',
		//secure: true
	},
	rolling: true
};

if (process.env.NODE_ENV === 'production') {
	sessionOptions.cookie.secure = true;
	sessionOptions.cookie.sameSite = 'none';
}

const session = expressSession(sessionOptions);

sequelizeStore.sync();

export default session;
