'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('updates', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			organizationId: {
				type: Sequelize.INTEGER
			},
			submittingUserId: {
				type: Sequelize.INTEGER
			},
			title: {
				type: Sequelize.TEXT
			},
			content: {
				type: Sequelize.TEXT
			},
			type: {
				type: Sequelize.ENUM('private', 'public')
			},
			approved: {
				type: Sequelize.BOOLEAN
			},
			localPinned: {
				type: Sequelize.BOOLEAN
			},
			globalPinned: {
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
		await queryInterface.dropTable('updates');
	}
};
