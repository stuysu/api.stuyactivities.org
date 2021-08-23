'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.addColumn(
			'charteredits',
			'socials',
			Sequelize.DataTypes.STRING
		);
	},

	down: async (queryInterface, Sequelize) => {
		queryInterface.removeColumn('charteredits', 'socials');
	}
};
