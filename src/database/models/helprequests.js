'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
import findManyLoader from '../dataloaders/findManyLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class helpRequests extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			helpRequests.belongsTo(models.users);
			helpRequests.hasMany(models.helpRequestMessages);
		}

		static idLoader = findOneLoader(helpRequests);
		static userIdLoader = findManyLoader(helpRequests, 'userId');
		static ipAddressLoader = findManyLoader(helpRequests, 'ipAddress');
	}
	helpRequests.init(
		{
			userId: DataTypes.INTEGER,
			email: DataTypes.STRING,
			title: DataTypes.STRING,
			description: DataTypes.TEXT,
			captchaToken: DataTypes.STRING(1024),
			honeybadgerId: DataTypes.STRING,
			path: DataTypes.STRING,
			status: DataTypes.STRING,
			ipAddress: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'helpRequests'
		}
	);
	return helpRequests;
};
