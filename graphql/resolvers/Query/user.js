const models = require('./../../../database');
const users = models.users;
const { UserInputError } = require('apollo-server-express');

module.exports = async (root, { with: { id, email } }, context) => {
	if (!id && !email) {
		throw new UserInputError(
			'You must pass an id or an email to query users.',
			{
				invalidArgs: ['id', 'email']
			}
		);
	}

	if (email) {
		return users.findOne({ where: { email } });
	}

	return users.findOne({ where: { id } });
};
