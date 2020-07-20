'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('commitments', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			organizationId: {
				type: Sequelize.INTEGER
			},
			level: {
				type: Sequelize.ENUM('low', 'high', 'medium')
			},
			frequency: {
				type: Sequelize.INTEGER
			},
			description: {
				type: Sequelize.TEXT
			},
			days: {
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
		await queryInterface.dropTable('commitments');
	}
};
