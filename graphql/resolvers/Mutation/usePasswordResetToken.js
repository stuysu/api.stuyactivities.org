const { ApolloError } = require('apollo-server-express');
const bcrypt = require('bcrypt');

module.exports = async (root, { token, password }, { models }) => {
	const maxAge = 1000 * 60 * 60;
	const earliestValidTokenDate = new Date(new Date().getTime() - maxAge);

	const { passwordResets, users, Sequelize } = models;

	const $gt = Sequelize.Op.gt;

	const resetToken = await passwordResets.findOne({
		where: {
			token,
			createdAt: {
				[$gt]: earliestValidTokenDate
			}
		}
	});

	if (!resetToken) {
		throw new ApolloError(
			'The password reset token you are using is invalid.',
			'INVALID_TOKEN'
		);
	}

	const user = await resetToken.getUser();

	const canUsePassword = users.validatePassword(password);

	if (!canUsePassword) {
		throw new ApolloError(
			'The password does not meet the security criteria.',
			'INSECURE_PASSWORD'
		);
	}

	user.password = await bcrypt.hash(password, 12);
	await user.save();
	await resetToken.destroy();
	return true;
};
