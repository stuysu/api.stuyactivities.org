'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class updateLinks extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			updateLinks.belongsTo(models.updates);
		}

		static updateIdLoader = findManyLoader(updateLinks, 'updateId');
		static idLoader = findOneLoader(updateLinks);
	}
	updateLinks.init(
		{
			updateId: DataTypes.INTEGER,
			url: DataTypes.TEXT,
			title: DataTypes.TEXT,
			description: DataTypes.TEXT,
			siteName: DataTypes.TEXT,
			image: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'updateLinks'
		}
	);
	return updateLinks;
};