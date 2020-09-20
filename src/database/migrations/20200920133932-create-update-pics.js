'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('updatePics', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			updateId: {
				type: Sequelize.INTEGER
			},
			publicId: {
				type: Sequelize.STRING
			},
			width: {
				type: Sequelize.INTEGER
			},
			height: {
				type: Sequelize.INTEGER
			},
			mimetype: {
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
		await queryInterface.dropTable('updatePics');
	}
};
