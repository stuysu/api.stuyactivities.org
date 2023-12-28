'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('users', 'isFaculty', {
			type: Sequelize.DataTypes.BOOLEAN,
			allowNull: false
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn('users', 'isFaculty', {
			type: Sequelize.DataTypes.BOOLEAN,
			allowNull: true
		});
	}
};
