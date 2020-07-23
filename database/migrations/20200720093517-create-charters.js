'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('charters', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			organizationId: {
				type: Sequelize.INTEGER
			},
			picture: {
				type: Sequelize.STRING
			},
			mission: {
				type: Sequelize.TEXT
			},
			purpose: {
				type: Sequelize.TEXT
			},
			benefit: {
				type: Sequelize.TEXT
			},
			appointmentProcedures: {
				type: Sequelize.TEXT
			},
			uniqueness: {
				type: Sequelize.TEXT
			},
			meetingSchedule: {
				type: Sequelize.TEXT
			},
			meetingDays: {
				type: Sequelize.STRING
			},
			meetingFrequency: {
				type: Sequelize.INTEGER
			},
			commitmentLevel: {
				type: Sequelize.ENUM('low', 'medium', 'high')
			},
			keywords: {
				type: Sequelize.STRING
			},
			extra: {
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
		await queryInterface.dropTable('charters');
	}
};
