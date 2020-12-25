'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cloudinaryResources', {
			id: {
				type: Sequelize.STRING,
				allowNull: false,
				primaryKey: true
			},
			assetId: {
				type: Sequelize.STRING
			},
			width: {
				type: Sequelize.INTEGER
			},
			height: {
				type: Sequelize.INTEGER
			},
			format: {
				type: Sequelize.STRING
			},
			resourceType: {
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
		await queryInterface.dropTable('cloudinaryResources');
	}
};
