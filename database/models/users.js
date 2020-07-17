'use strict';
const { Model } = require('sequelize');
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
			users.hasMany(models.adminRoles, {
				foreignKey: 'email',
				sourceKey: 'email'
			});

			users.hasMany(models.passwordResets);
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
			active: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'users'
		}
	);
	return users;
};
