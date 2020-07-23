'use strict';
const { Model } = require('sequelize');
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
