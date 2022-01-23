'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class promotedClubs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			promotedClubs.belongsTo(models.organizations);
		}
		static orgIdLoader = findOneLoader(promotedClubs, 'organizationId');
    static idLoader = findOneLoader(promotedClubs, 'id');
	}
	promotedClubs.init(
		{
			organizationId: DataTypes.INTEGER,
			blurb: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'promotedClubs'
		}
	);
	return promotedClubs;
};
