const nunjucks = require('nunjucks');
const path = require('path');

const templatesPath = path.resolve(__dirname, './../emailTemplates');
nunjucks.configure(templatesPath, {
	autoescape: true
});

module.exports = nunjucks;
