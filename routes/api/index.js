const router = require('express').Router();

router.use('/state', require('./state'));

module.exports = router;
