const sessionSecret =
	process.env.SESSION_SECRET || 'some_semi_permanent_secret';
const router = require('express').Router();

const cookieParser = require('cookie-parser');
router.use(cookieParser(sessionSecret));

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

module.exports = router;
