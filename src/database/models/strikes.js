'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
import findManyLoader from '../dataloaders/findManyLoader';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class strikes extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}

		static orgIdLoader = findManyLoader(strikes, 'organizationId');
		static idLoader = findOneLoader(strikes, 'id');
		static reviewerIdLoader = findManyLoader(strikes, 'reviewerId');
	}
	strikes.init(
		{
			organizationId: DataTypes.INTEGER,
			weight: DataTypes.INTEGER,
			reviewerId: DataTypes.INTEGER,
			reason: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'strikes'
		}
	);
	return strikes;
};
