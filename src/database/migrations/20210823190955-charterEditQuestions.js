'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.addColumn(
			'charterEdits',
			'socials',
			Sequelize.DataTypes.STRING
		);
	},

	down: async (queryInterface, Sequelize) => {
		queryInterface.removeColumn('charterEdits', 'socials');
	}
};
