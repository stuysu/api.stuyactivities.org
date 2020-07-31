const { users, oAuthIds, adminRoles } = require('../../../database');
import { UserInputError } from 'apollo-server-express';

export default async (root, { email, id }, context) => {
	if (!id && !email) {
		throw new UserInputError(
			'You must pass an id or an email to query a user.',
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
