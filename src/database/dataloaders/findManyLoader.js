import Dataloader from 'dataloader';

const findManyLoader = (model, field) =>
	new Dataloader(
		async keys => {
			const keyMap = {};

			const uniqueKeys = [...new Set(keys)];
			const entries = await model.findAll({
				where: { [field]: uniqueKeys }
			});

			for (let x = 0; x < entries.length; x++) {
				const entry = entries[x];
				const key = entry[field];

				if (!keyMap[key]) {
					keyMap[key] = [];
				}

				keyMap[key].push(entry);
			}

			const response = [];

			for (let x = 0; x < keys.length; x++) {
				const key = keys[x];
				response.push(keyMap[key] || []);
			}

			return response;
		},
		{ cache: false }
	);

export default findManyLoader;
