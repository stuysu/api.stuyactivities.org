const { UserInputError } = require('apollo-server-express');
module.exports = (root, args, context) => {
	const { id, url } = args;
	const {
		models: { organizations }
	} = context;

	if (!id && !url) {
		throw new UserInputError(
			'You must pass a url or an id to query an organization.',
			{
				invalidArgs: ['id', 'url']
			}
		);
	}

	if (id) {
		return organizations.findOne({ where: { id } });
	}

	if (url) {
		return organizations.findOne({ where: { url } });
	}
};
