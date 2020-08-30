'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('helpMessages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			helpRequestId: {
				type: Sequelize.INTEGER
			},
			userId: {
				type: Sequelize.INTEGER
			},
			role: {
				type: Sequelize.STRING
			},
			message: {
				type: Sequelize.TEXT
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('helpMessages');
	}
};
