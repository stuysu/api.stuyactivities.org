'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(
			'recurringMeetings',
			'lastCreated',
			Sequelize.DataTypes.DATE
		);
		await queryInterface.removeColumn('recurringMeetings', 'lastActivated');
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn(
			'recurringMeetings',
			'lastActivated',
			Sequelize.DataTypes.DATE
		);
		await queryInterface.removeColumn('recurringMeetings', 'lastCreated');
	}
};
