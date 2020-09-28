'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class helpRequestMessages extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			helpRequestMessages.belongsTo(models.helpRequests);
			helpRequestMessages.belongsTo(models.users);
		}

		static userIdLoader = findManyLoader(helpRequestMessages, 'userId');
		static helpRequestIdLoader = findManyLoader(
			helpRequestMessages,
			'helpRequestId'
		);
		static idLoader = findOneLoader(helpRequestMessages);
	}
	helpRequestMessages.init(
		{
			helpRequestId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			role: DataTypes.STRING,
			message: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'helpRequestMessages'
		}
	);
	return helpRequestMessages;
};
