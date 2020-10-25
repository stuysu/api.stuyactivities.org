'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class updateQuestions extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			updateQuestions.belongsTo(models.users);
			updateQuestions.belongsTo(models.updates);
		}

		static updateIdLoader = findManyLoader(updateQuestions, 'updateId');
		static idLoader = findOneLoader(updateQuestions, 'id');
	}
	updateQuestions.init(
		{
			userId: DataTypes.INTEGER,
			updateId: DataTypes.INTEGER,
			question: DataTypes.STRING,
			answer: DataTypes.STRING,
			private: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'updateQuestions'
		}
	);
	return updateQuestions;
};
