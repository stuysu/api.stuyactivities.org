'use strict';
import { Model } from 'sequelize';
import findOneLoader from '../dataloaders/findOneLoader';
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

		static orgIdLoader = findOneLoader(charters, 'organizationId');
		static idLoader = findOneLoader(charters, 'id');
	}
	charters.init(
		{
			organizationId: DataTypes.INTEGER,
			picture: DataTypes.STRING,
			mission: DataTypes.TEXT,
			purpose: DataTypes.TEXT,
			benefit: DataTypes.TEXT,
			appointmentProcedures: DataTypes.TEXT,
			uniqueness: DataTypes.TEXT,
			meetingSchedule: DataTypes.TEXT,
			meetingDays: DataTypes.STRING,
			returningInfo: DataTypes.TEXT,
			commitmentLevel: DataTypes.ENUM('low', 'medium', 'high'),
			keywords: DataTypes.STRING,
			extra: DataTypes.TEXT,
			socials: DataTypes.STRING,
			clubpubParticipant: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'charters'
		}
	);
	return charters;
};
