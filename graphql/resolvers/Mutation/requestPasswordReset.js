const { ApolloError } = require('apollo-server-express');

module.exports = async (root, args, context) => {
	const { email } = args;
	const { users, passwordResets } = context.models;

	const user = await users.findOne({
		where: {
			email
		}
	});

	if (!user) {
		throw new ApolloError(
			'There is no user with that email address',
			'USER_NOT_FOUND'
		);
	}

	const numResets = await passwordResets.count({
		where: { userId: user.id }
	});
};
