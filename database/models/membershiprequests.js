'use strict';
const { Model } = require('sequelize');
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
