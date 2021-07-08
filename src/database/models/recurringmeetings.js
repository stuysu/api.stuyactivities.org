'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
import findManyLoader from '../dataloaders/findManyLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class recurringMeetings extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			recurringMeetings.belongsTo(models.organizations);
		}
		static orgIdLoader = findManyLoader(
			recurringMeetings,
			'organizationId'
		);
		static idLoader = findOneLoader(recurringMeetings, 'id');
	}
	recurringMeetings.init(
		{
			organizationId: DataTypes.INTEGER,
			dayOfWeek: DataTypes.INTEGER,
			start: DataTypes.TIME,
			end: DataTypes.TIME,
			lastCreated: DataTypes.DATE,
			title: DataTypes.STRING,
			description: DataTypes.STRING,
			privacy: DataTypes.ENUM('public', 'private'),
			frequency: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'recurringMeetings'
		}
	);
	return recurringMeetings;
};
