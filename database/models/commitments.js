'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class commitments extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	commitments.init(
		{
			organizationId: DataTypes.INTEGER,
			level: DataTypes.ENUM('low', 'high', 'medium'),
			frequency: DataTypes.INTEGER,
			description: DataTypes.TEXT,
			days: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'commitments'
		}
	);
	return commitments;
};
