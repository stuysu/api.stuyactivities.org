'use strict';
import { Model } from 'sequelize';
import findManyLoader from '../dataloaders/findManyLoader';
module.exports = (sequelize, DataTypes) => {
	class charterEdits extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			charterEdits.belongsTo(models.organizations);
			charterEdits.belongsTo(models.users, {
				as: 'submittingUser',
				foreignKey: 'submittingUserId',
				targetKey: 'id'
			});

			charterEdits.belongsTo(models.users, {
				as: 'reviewer',
				foreignKey: 'reviewerId',
				targetKey: 'id'
			});
		}

		static orgIdLoader = findManyLoader(charterEdits, 'organizationId');
	}
	charterEdits.init(
		{
			organizationId: DataTypes.INTEGER,
			submittingUserId: DataTypes.INTEGER,
			picture: DataTypes.STRING,
			mission: DataTypes.TEXT,
			purpose: DataTypes.TEXT,
			benefit: DataTypes.TEXT,
			appointmentProcedures: DataTypes.TEXT,
			uniqueness: DataTypes.TEXT,
			meetingSchedule: DataTypes.TEXT,
			meetingDays: DataTypes.STRING,
			meetingFrequency: DataTypes.INTEGER,
			commitmentLevel: DataTypes.ENUM('low', 'medium', 'high'),
			keywords: DataTypes.STRING,
			extra: DataTypes.TEXT,
			status: {
				type: DataTypes.ENUM('pending', 'rejected', 'approved'),
				defaultValue: 'pending'
			},
			reviewerId: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'charterEdits'
		}
	);
	return charterEdits;
};
