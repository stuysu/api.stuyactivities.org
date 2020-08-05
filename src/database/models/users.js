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

			users.hasMany(models.membershipRequests);
			users.hasMany(models.memberships);
		}

		static idLoader = findOneLoader(users);
	}

	users.init(
		{
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			email: DataTypes.STRING,
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
