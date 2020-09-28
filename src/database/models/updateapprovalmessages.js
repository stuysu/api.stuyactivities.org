'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
import findManyLoader from '../dataloaders/findManyLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class updateApprovalMessages extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			updateApprovalMessages.belongsTo(models.updates);
		}

		static idLoader = findOneLoader(updateApprovalMessages);
		static updateIdLoader = findManyLoader(
			updateApprovalMessages,
			'updateId'
		);
	}
	updateApprovalMessages.init(
		{
			updateId: DataTypes.STRING,
			userId: DataTypes.INTEGER,
			role: DataTypes.ENUM('clubpub', 'organization'),
			message: DataTypes.TEXT,
			seen: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'updateApprovalMessages'
		}
	);
	return updateApprovalMessages;
};
