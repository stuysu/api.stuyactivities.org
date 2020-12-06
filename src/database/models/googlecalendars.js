'use strict';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class googleCalendars extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			googleCalendars.belongsTo(models.organizations);
		}

		static idLoader = findOneLoader(googleCalendars);
		static orgIdLoader = findOneLoader(googleCalendars, 'organizationId');

		getJoinUrl(email) {
			const googleCalendarUrl = new URL(
				'https://calendar.google.com/calendar/render'
			);

			googleCalendarUrl.searchParams.append('cid', this.gCalId);
			if (email) {
				googleCalendarUrl.searchParams.append('authuser', email);
			}

			return googleCalendarUrl.href;
		}
	}
	googleCalendars.init(
		{
			organizationId: DataTypes.INTEGER,
			gCalId: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'googleCalendars'
		}
	);
	return googleCalendars;
};
