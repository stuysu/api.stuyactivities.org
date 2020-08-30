'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class helpMessages extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			helpMessages.belongsTo(models.helpRequests);
			helpMessages.belongsTo(models.users);
		}

		static userIdLoader = findManyLoader(helpMessages, 'userId');
		static helpRequestIdLoader = findManyLoader(
			helpMessages,
			'helpRequestId'
		);
		static idLoader = findOneLoader(helpMessages);
	}
	helpMessages.init(
		{
			helpRequestId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			role: DataTypes.STRING,
			message: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'helpMessages'
		}
	);
	return helpMessages;
};
