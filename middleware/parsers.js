const { SESSION_SECRET } = require('./.././constants');
const router = require('express').Router();

const cookieParser = require('cookie-parser');
router.use(cookieParser(SESSION_SECRET));

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

module.exports = router;
