'use strict';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class googleCalendarEvents extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			googleCalendarEvents.belongsTo(models.googleCalendars);
			googleCalendarEvents.belongsTo(models.meetings);
		}

		static idLoader = findOneLoader(googleCalendarEvents);
		static googleCalendarIdLoader = findOneLoader(
			googleCalendarEvents,
			'googleCalendarId'
		);

		static meetingIdLoader = findOneLoader(
			googleCalendarEvents,
			'meetingId'
		);
	}
	googleCalendarEvents.init(
		{
			googleCalendarId: DataTypes.INTEGER,
			meetingId: DataTypes.INTEGER,
			gCalEventId: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'googleCalendarEvents'
		}
	);
	return googleCalendarEvents;
};
