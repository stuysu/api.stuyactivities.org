'use strict';
import { Model } from 'sequelize';
import findManyLoader from '../dataloaders/findManyLoader';

module.exports = (sequelize, DataTypes) => {
	class memberships extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			memberships.belongsTo(models.organizations);
			memberships.belongsTo(models.users);
		}

		static userIdLoader = findManyLoader(memberships, 'userId');
		static orgIdLoader = findManyLoader(memberships, 'organizationId');
	}
	memberships.init(
		{
			organizationId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			role: DataTypes.STRING,
			adminPrivileges: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'memberships'
		}
	);
	return memberships;
};
