'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('membershipRequests', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			organizationId: {
				type: Sequelize.INTEGER
			},
			userId: {
				type: Sequelize.INTEGER
			},
			role: {
				type: Sequelize.STRING
			},
			adminPrivileges: {
				type: Sequelize.BOOLEAN
			},
			userMessage: {
				type: Sequelize.STRING
			},
			adminMessage: {
				type: Sequelize.STRING
			},
			userApproval: {
				type: Sequelize.BOOLEAN
			},
			adminApproval: {
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
		await queryInterface.dropTable('membershipRequests');
	}
};
