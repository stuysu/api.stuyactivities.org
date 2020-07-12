'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class adminRoles extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			adminRoles.belongsTo(models.users, {
				foreignKey: 'email',
				targetKey: 'email'
			});
		}
	}
	adminRoles.init(
		{
			email: DataTypes.STRING,
			role: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'adminRoles'
		}
	);
	return adminRoles;
};
