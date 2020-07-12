'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			firstName: {
				type: Sequelize.STRING
			},
			lastName: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
			},
			password: {
				type: Sequelize.STRING
			},
			gradYear: {
				type: Sequelize.INTEGER
			},
			isFaculty: {
				type: Sequelize.BOOLEAN
			},
			active: {
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
		await queryInterface.dropTable('users');
	}
};
