'use strict';
import { Model } from 'sequelize';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';
module.exports = (sequelize, DataTypes) => {
	class membershipRequests extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			membershipRequests.belongsTo(models.users);
			membershipRequests.belongsTo(models.organizations);
		}

		static userIdLoader = findManyLoader(membershipRequests, 'userId');
		static orgIdLoader = findManyLoader(
			membershipRequests,
			'organizationId'
		);

		static idLoader = findOneLoader(membershipRequests, 'id');
	}
	membershipRequests.init(
		{
			organizationId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			role: DataTypes.STRING,
			adminPrivileges: DataTypes.BOOLEAN,
			userMessage: DataTypes.STRING,
			adminMessage: DataTypes.STRING,
			userApproval: DataTypes.BOOLEAN,
			adminApproval: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'membershipRequests'
		}
	);
	return membershipRequests;
};
