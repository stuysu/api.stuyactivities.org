'use strict';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class sports extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			sports.hasMany(models.sportsCaptains);
		}

		static idLoader = findOneLoader(sports, 'id');
	}
	sports.init(
		{
			name: DataTypes.STRING,
			picture: DataTypes.STRING,
			coach: DataTypes.STRING,
			coachEmail: DataTypes.STRING,
			tryouts: DataTypes.TEXT,
			commitment: DataTypes.TEXT,
			schedule: DataTypes.TEXT,
			experience: DataTypes.TEXT,
			equipment: DataTypes.TEXT,
			moreInfo: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'sports'
		}
	);
	return sports;
};
