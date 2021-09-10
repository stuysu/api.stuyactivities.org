'use strict';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class sportsCaptains extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			sportsCaptains.belongsTo(models.sports);
			// define association here
		}
		static idLoader = findOneLoader(sportsCaptains, 'id');
		static sportIdLoader = findManyLoader(sportsCaptains, 'sportId');
	}
	sportsCaptains.init(
		{
			userId: DataTypes.INTEGER,
			sportId: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'sportsCaptains'
		}
	);
	return sportsCaptains;
};
