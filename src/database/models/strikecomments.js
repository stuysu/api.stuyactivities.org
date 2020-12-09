'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class strikeComments extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			strikeComments.belongsTo(models.strikes);
			strikeComments.belongsTo(models.users);
		}
		static strikeIdLoader = findManyLoader(strikeComments, 'strikeId');
		static userIdLoader = findManyLoader(strikeComments, 'userId');
		static idLoader = findOneLoader(strikeComments, 'id');
	}
	strikeComments.init(
		{
			strikeId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			message: DataTypes.TEXT,
			auto: DataTypes.BOOLEAN,
			seen: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'strikeComments'
		}
	);
	return strikeComments;
};
