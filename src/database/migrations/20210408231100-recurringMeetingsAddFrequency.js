'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.addColumn(
			'recurringMeetings',
			'frequency',
			Sequelize.DataTypes.INTEGER
		);
	},

	down: async (queryInterface, Sequelize) => {
		queryInterface.removeColumn('recurringMeetings', 'frequency');
	}
};
