const fs = require('fs');
const path = require('path');
const schemas = [];
const thisFile = path.resolve(__filename);

const files = fs.readdirSync(__dirname);

files
	.map(schema => path.resolve(__dirname, schema))
	.filter(file => file !== thisFile)
	.forEach(file => {
		schemas.push(require(file));
	});

module.exports = schemas;
