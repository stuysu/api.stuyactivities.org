'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class charterApprovalMessages extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			charterApprovalMessages.belongsTo(models.organizations);
			charterApprovalMessages.belongsTo(models.users);
		}
	}
	charterApprovalMessages.init(
		{
			organizationId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			message: DataTypes.TEXT,
			auto: DataTypes.BOOLEAN,
			seen: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'charterApprovalMessages'
		}
	);
	return charterApprovalMessages;
};
