'use strict';
const { Model } = require('sequelize');
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

			charterEdits.hasMany(models.charterEditComments, {
				as: 'comments',
				foreignKey: 'charterEditId',
				sourceKey: 'id'
			});
		}
	}
	charterEdits.init(
		{
			organizationId: DataTypes.INTEGER,
			submittingUserId: DataTypes.INTEGER,
			mission: DataTypes.TEXT,
			purpose: DataTypes.TEXT,
			benefit: DataTypes.TEXT,
			appointmentProcedures: DataTypes.TEXT,
			uniqueness: DataTypes.TEXT,
			meetingSchedule: DataTypes.TEXT,
			meetingDays: DataTypes.STRING,
			meetingFrequency: DataTypes.INTEGER,
			commitmentLevel: DataTypes.STRING,
			extra: DataTypes.TEXT,
			approved: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
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
