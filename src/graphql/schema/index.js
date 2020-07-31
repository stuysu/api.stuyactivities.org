import fs from 'fs';
import path from 'path';
const schemas = [];
const thisFile = path.resolve(__filename);

const files = fs.readdirSync(__dirname);

files
	.map(schema => path.resolve(__dirname, schema))
	.filter(file => file !== thisFile)
	.forEach(file => {
		const schema = require(file);
		schemas.push(schema.default || schema);
	});

export default schemas;
