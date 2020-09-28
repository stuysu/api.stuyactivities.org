'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('updateApprovalMessages', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			updateId: {
				type: Sequelize.STRING
			},
			userId: {
				type: Sequelize.INTEGER
			},
			role: {
				type: Sequelize.ENUM('clubpub', 'organization')
			},
			message: {
				type: Sequelize.TEXT
			},
			seen: {
				type: Sequelize.BOOLEAN
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
		await queryInterface.dropTable('updateApprovalMessages');
	}
};
