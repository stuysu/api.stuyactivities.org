'use strict';
import { Model } from 'sequelize';
import findManyLoader from '../dataloaders/findManyLoader';

module.exports = (sequelize, DataTypes) => {
	class adminRoles extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			adminRoles.belongsTo(models.users);
		}

		static userIdLoader = findManyLoader(adminRoles, 'userId');
	}
	adminRoles.init(
		{
			userId: DataTypes.INTEGER,
			role: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'adminRoles'
		}
	);
	return adminRoles;
};
