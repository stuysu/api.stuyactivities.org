const Dataloader = require('dataloader');

const findManyLoader = (model, field) =>
	new Dataloader(async keys => {
		const keyMap = {};

		const entries = model.findAll({ where: { [field]: keys } });

		entries.forEach(entry => {
			const key = entry[field];

			if (!keyMap[key]) {
				keyMap[key] = [];
			}

			keyMap[key].push(entry);
		});

		return keys.map(key => keyMap[key] || []);
	});

module.exports = findManyLoader;