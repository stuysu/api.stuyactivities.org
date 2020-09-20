'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class updatePics extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			updatePics.belongsTo(models.updates);
		}

		static updateIdLoader = findManyLoader(updatePics, 'updateId');
		static idLoader = findOneLoader(updatePics);
	}
	updatePics.init(
		{
			updateId: DataTypes.INTEGER,
			publicId: DataTypes.STRING,
			description: DataTypes.TEXT,
			width: DataTypes.INTEGER,
			height: DataTypes.INTEGER,
			mimetype: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'updatePics'
		}
	);
	return updatePics;
};
