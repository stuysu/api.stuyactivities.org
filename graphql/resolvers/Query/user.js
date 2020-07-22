const { users, oAuthIds, adminRoles } = require('./../../../database');
const { UserInputError } = require('apollo-server-express');

module.exports = async (root, { email, id }, context) => {
	if (!id && !email) {
		throw new UserInputError(
			'You must pass an id or an email to query users.',
			{
				invalidArgs: ['id', 'email']
			}
		);
	}

	if (email) {
		return users.findOne({
			where: { email },
			include: [
				{
					model: adminRoles
				}
			]
		});
	}

	return users.findOne({
		where: { id },
		include: [
			{
				model: adminRoles
			}
		]
	});
};
