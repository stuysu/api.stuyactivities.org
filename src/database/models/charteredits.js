'use strict';
import { Model } from 'sequelize';
import { EDITABLE_CHARTER_FIELDS } from '../../constants';
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

		// Rejects pending charterEdit fields and returns a charterEdit object containing the rejected fields
		async rejectFields(fields, reviewerId) {
			// If this edit has any fields that aren't null and aren't being rejected, we should preserve it
			const shouldCreateNewObject = EDITABLE_CHARTER_FIELDS.some(
				field =>
					typeof this[field] !== 'undefined' &&
					this[field] !== null &&
					!fields.includes(field)
			);

			if (!shouldCreateNewObject) {
				this.status = 'rejected';
				await this.save();
				return this;
			}

			const newObject = {
				organizationId: this.organizationId,
				submittingUserId: this.submittingUserId,
				reviewerId,
				status: 'rejected',
				createdAt: this.createdAt
			};

			for (let x = 0; x < fields; x++) {
				const field = fields[x];

				if (
					typeof this[field] !== 'undefined' &&
					this[field] !== null
				) {
					newObject[field] = this[field];
					this[field] = null;
				}
			}

			await this.save();

			return await charterEdits.create(newObject);
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
