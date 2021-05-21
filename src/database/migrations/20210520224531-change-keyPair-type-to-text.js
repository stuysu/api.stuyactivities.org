'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.changeColumn('keyPairs', 'privateKey', {
			type: Sequelize.TEXT,
			allowNull: true
		});

		await queryInterface.changeColumn('keyPairs', 'publicKey', {
			type: Sequelize.TEXT,
			allowNull: true
		});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.changeColumn('keyPairs', 'privateKey', {
			type: Sequelize.STRING,
			allowNull: true
		});

		await queryInterface.changeColumn('keyPairs', 'publicKey', {
			type: Sequelize.STRING,
			allowNull: true
		});
	}
};
