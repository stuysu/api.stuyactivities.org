import Dataloader from 'dataloader';

const findOneLoader = (model, key = 'id') => {
	return new Dataloader(
		async keyValues => {
			const keyMap = {};

			const results = await model.findAll({
				where: { [key]: keyValues }
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
