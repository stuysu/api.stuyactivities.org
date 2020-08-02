import bcrypt from 'bcrypt';
import { Model } from 'sequelize';
import findOneLoader from '../dataloaders/findOneLoader';

module.exports = (sequelize, DataTypes) => {
	class users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			users.hasMany(models.oAuthIds);
			users.hasMany(models.adminRoles);

			users.hasMany(models.passwordResets);

			users.hasMany(models.membershipRequests);
			users.hasMany(models.memberships);
		}

		async comparePassword(password) {
			if (!this.password) {
				return false;
			}

			return await bcrypt.compare(password, this.password);
		}

		static idLoader = findOneLoader(users);

		static validatePassword(password) {
			if (password.length < 8) {
				return false;
			}

			const hasLowercase = password.match(/[a-z]/);
			const hasUppercase = password.match(/[A-Z]/);
			const hasNumbers = password.match(/[0-9]/);

			return hasLowercase && hasUppercase && hasNumbers;
		}
	}

	users.init(
		{
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			gradYear: DataTypes.INTEGER,
			isFaculty: DataTypes.BOOLEAN,
			active: DataTypes.BOOLEAN,
			picture: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'users'
		}
	);
	return users;
};
