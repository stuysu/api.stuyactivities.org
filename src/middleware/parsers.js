const { SESSION_SECRET } = require('../constants');
const parsers = require('express').Router();

const cookieParser = require('cookie-parser');
parsers.use(cookieParser(SESSION_SECRET));

const bodyParser = require('body-parser');
parsers.use(bodyParser.urlencoded({ extended: false }));
parsers.use(bodyParser.json());

export default parsers;
