import Dataloader from 'dataloader';

const findOneLoader = (model, key = 'id') => {
	return new Dataloader(
		async keyValues => {
			const keyMap = {};

			const uniqueKeys = [...new Set(keyValues)];
			const results = await model.findAll({
				where: { [key]: uniqueKeys }
			});

			results.forEach(instance => {
				keyMap[instance[key]] = instance;
			});

			return keyValues.map(keyVal => keyMap[keyVal] || null);
		},
		{ cache: false }
	);
};

export default findOneLoader;
