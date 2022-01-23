'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class promotedClub extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			promotedClub.belongsTo(models.organizations);
		}
		static orgIdLoader = findOneLoader(promotedClub, 'organizationId');
	}
	promotedClub.init(
		{
			organizationId: DataTypes.INTEGER,
			blurb: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'promotedClub'
		}
	);
	return promotedClub;
};
