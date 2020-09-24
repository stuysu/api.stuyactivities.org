'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class joinInstructions extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			joinInstructions.belongsTo(models.organizations);
		}
		static orgIdLoader = findOneLoader(joinInstructions, 'organizationId');
	}
	joinInstructions.init(
		{
			organizationId: DataTypes.INTEGER,
			instructions: DataTypes.STRING,
			buttonEnabled: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'joinInstructions'
		}
	);
	return joinInstructions;
};
