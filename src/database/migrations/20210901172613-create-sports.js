'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('sports', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			picture: {
				type: Sequelize.STRING
			},
			coach: {
				type: Sequelize.STRING
			},
			coachEmail: {
				type: Sequelize.STRING
			},
			tryouts: {
				type: Sequelize.TEXT
			},
			commitment: {
				type: Sequelize.TEXT
			},
			schedule: {
				type: Sequelize.TEXT
			},
			experience: {
				type: Sequelize.TEXT
			},
			equipment: {
				type: Sequelize.TEXT
			},
			moreInfo: {
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
		await queryInterface.dropTable('sports');
	}
};
