'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('settings', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			membershipRequirement: {
				type: Sequelize.INTEGER
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
		await queryInterface.bulkInsert('settings', [
			{
				membershipRequirement: 0,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('settings');
	}
};
