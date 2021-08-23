'use strict';
import { Model } from 'sequelize';
import { EDITABLE_CHARTER_FIELDS } from '../../constants';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';
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

		static idLoader = findOneLoader(charterEdits, 'id');
		static orgIdLoader = findManyLoader(charterEdits, 'organizationId');
		static reviewerIdLoader = findManyLoader(charterEdits, 'reviewerId');
		static submittingUserIdLoader = findManyLoader(
			charterEdits,
			'submittingUserId'
		);

		getAlteredFields() {
			return EDITABLE_CHARTER_FIELDS.filter(
				field =>
					typeof this[field] !== 'undefined' && this[field] !== null
			);
		}
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
			commitmentLevel: DataTypes.ENUM('low', 'medium', 'high'),
			keywords: DataTypes.STRING,
			extra: DataTypes.TEXT,
			status: {
				type: DataTypes.ENUM('pending', 'rejected', 'approved'),
				defaultValue: 'pending'
			},
			reviewerId: DataTypes.INTEGER,
			socials: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'charterEdits'
		}
	);
	return charterEdits;
};
