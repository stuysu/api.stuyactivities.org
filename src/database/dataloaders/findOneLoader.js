import Dataloader from 'dataloader';

const findOneLoader = (model, key = 'id', conditions = {}) => {
	return new Dataloader(
		async keyValues => {
			const keyMap = {};

			const uniqueKeys = [...new Set(keyValues)];
			const results = await model.findAll({
				where: { [key]: uniqueKeys, ...conditions }
			});

			for (let x = 0; x < results.length; x++) {
				const instance = results[x];
				keyMap[instance[key]] = instance;
			}

			const response = [];

			for (let x = 0; x < keyValues.length; x++) {
				const keyVal = keyValues[x];
				response.push(keyMap[keyVal] || null);
			}

			return response;
		},
		{ cache: false }
	);
};

export default findOneLoader;
