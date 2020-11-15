'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class strikecomments extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
		static orgIdLoader = findManyLoader(strikecomments, 'organizationId');
		static strikeIdLoader = findManyLoader(strikecomments, 'strikeId');
		static userIdLoader = findManyLoader(strikecomments, 'userId');
		static idLoader = findOneLoader(strikecomments, 'id');
	}
	strikecomments.init(
		{
			organizationId: DataTypes.INTEGER,
			strikeId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			message: DataTypes.TEXT,
			auto: DataTypes.BOOLEAN,
			seen: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'strikecomments'
		}
	);
	return strikecomments;
};
