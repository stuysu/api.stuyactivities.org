import fs from 'fs';
import path from 'path';

const resolvers = {};

fs.readdirSync(__dirname, { withFileTypes: true })
	.filter(dir => dir.isDirectory())
	.map(dir => dir.name)
	.forEach(type => {
		const dirPath = path.resolve(__dirname, type);

		const propResolvers = {};
		const propResolverFiles = fs.readdirSync(dirPath, {
			withFileTypes: true
		});

		// If there is a default export, use that instead
		const defaultExport = propResolverFiles.some(
			file => file.name === 'index.js'
		);

		if (defaultExport) {
			const module = require(dirPath);
			resolvers[type] = module.default || module;
		} else {
			propResolverFiles.forEach(file => {
				const resolverPath = path.resolve(__dirname, type, file.name);

				const propName = path.parse(resolverPath).name;

				const module = require(resolverPath);
				propResolvers[propName] = module.default || module;
			});
			resolvers[type] = propResolvers;
		}
	});

export default resolvers;
