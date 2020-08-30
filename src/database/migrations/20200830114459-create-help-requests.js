'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('helpRequests', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				type: Sequelize.INTEGER
			},
			email: {
				type: Sequelize.STRING
			},
			title: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.TEXT
			},
			captchaToken: {
				type: Sequelize.STRING
			},
			status: {
				type: Sequelize.STRING
			},
			honeybadgerId: {
				type: Sequelize.STRING
			},
			path: {
				type: Sequelize.STRING
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
		await queryInterface.dropTable('helpRequests');
	}
};
