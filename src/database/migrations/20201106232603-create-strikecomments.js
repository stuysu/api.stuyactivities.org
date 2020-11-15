'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('strikecomments', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			organizationId: {
				type: Sequelize.INTEGER
			},
			strikeId: {
				type: Sequelize.INTEGER
			},
			userId: {
				type: Sequelize.INTEGER
			},
			message: {
				type: Sequelize.TEXT
			},
			auto: {
				type: Sequelize.BOOLEAN
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
		await queryInterface.dropTable('strikecomments');
	}
};
