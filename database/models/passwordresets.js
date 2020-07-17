'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class passwordResets extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			passwordResets.belongsTo(models.users, { foreignKey: 'userId' });
		}
	}
	passwordResets.init(
		{
			userId: DataTypes.INTEGER,
			token: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'passwordResets'
		}
	);
	return passwordResets;
};
