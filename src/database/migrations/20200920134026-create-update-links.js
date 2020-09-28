'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('updateLinks', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			updateId: {
				type: Sequelize.INTEGER
			},
			url: {
				type: Sequelize.TEXT
			},
			title: {
				type: Sequelize.TEXT
			},
			description: {
				type: Sequelize.TEXT
			},
			siteName: {
				type: Sequelize.TEXT
			},
			image: {
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
		await queryInterface.dropTable('updateLinks');
	}
};
