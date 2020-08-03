import Dataloader from 'dataloader';

const findManyLoader = (model, field) =>
	new Dataloader(
		async keys => {
			const keyMap = {};

			const uniqueKeys = [...new Set(keys)];
			const entries = await model.findAll({
				where: { [field]: uniqueKeys }
			});

			entries.forEach(entry => {
				const key = entry[field];

				if (!keyMap[key]) {
					keyMap[key] = [];
				}

				keyMap[key].push(entry);
			});

			return keys.map(key => keyMap[key] || []);
		},
		{ cache: false }
	);

export default findManyLoader;
