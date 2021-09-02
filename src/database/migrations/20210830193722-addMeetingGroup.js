'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.addColumn('meetings', 'groupId', {
			type: Sequelize.DataTypes.INTEGER,
			defaultValue: 0
		});
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('meetings', 'groupId');
	}
};
