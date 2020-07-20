'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class charters extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			charters.belongsTo(models.organizations);
		}
	}
	charters.init(
		{
			organizationId: DataTypes.INTEGER,
			mission: DataTypes.TEXT,
			purpose: DataTypes.TEXT,
			benefit: DataTypes.TEXT,
			appointmentProcedures: DataTypes.TEXT,
			uniqueness: DataTypes.TEXT,
			meetingSchedule: DataTypes.TEXT,
			meetingDays: DataTypes.STRING,
			meetingFrequency: DataTypes.INTEGER,
			commitmentLevel: DataTypes.STRING,
			extra: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'charters'
		}
	);
	return charters;
};
