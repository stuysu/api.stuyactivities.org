const models = require('./../../../database');
const users = models.users;

module.exports = async (root, { where: { id, email } }, context) => {
	if (!id) {
		id = '';
	}

	if (!email) {
		email = '';
	}

	if (!id && !email) {
		throw new Error('You must pass an id or an email to query users.');
	}

	return users.findOne({
		where: { [models.Sequelize.Op.or]: [{ email }, { id }] }
	});
};
