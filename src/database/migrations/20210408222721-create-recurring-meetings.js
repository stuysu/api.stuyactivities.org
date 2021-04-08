'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('recurringMeetings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			organizationId: {
				type: Sequelize.INTEGER
			},
			dayOfWeek: {
				type: Sequelize.INTEGER
			},
			start: {
				type: Sequelize.TIME
			},
			end: {
				type: Sequelize.TIME
			},
			lastActivated: {
				type: Sequelize.DATE
			},
			title: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING
			},
			privacy: {
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
		await queryInterface.dropTable('recurringMeetings');
	}
};
