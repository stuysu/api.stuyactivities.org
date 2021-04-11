'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.addColumn(
			'googleCalendarEvents',
			'recurringMeeting',
			Sequelize.DataTypes.BOOLEAN
		);
	},

	down: async (queryInterface, Sequelize) => {
		queryInterface.removeColumn('googleCalendarEvents', 'recurringMeeting');
	}
};
