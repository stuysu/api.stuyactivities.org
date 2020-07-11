const router = require('express').Router();
const url = require('url');

router.get('*', (req, res, next) => {
	req.og = {};
	req.og.site_name = 'Quicker Picker Upper';
	req.og.title = 'Error 404 - Page Not Found | Quicker Picker Upper';
	req.og.type = 'website';
	req.og.image = url.resolve(process.env.PUBLIC_URL || '', '/logo512.png');
	req.og.description = 'This page does not exist or has been moved';
	req.og.url = url.resolve(process.env.PUBLIC_URL || '', req.path);

	next();
});

router.get('/', (req, res, next) => {
	req.og.title = 'Home | Quicker Picker Upper';
	req.og.description = 'This is the home page...';
	next();
});

// Be able to print the open graph data if requested
// MAKE SURE THIS HANDLER GOES AT THE VERY END
router.get('*', (req, res, next) => {
	if (typeof req.query.printOG !== 'undefined') {
		res.json(req.og);
	} else {
		next();
	}
});

module.exports = router;
