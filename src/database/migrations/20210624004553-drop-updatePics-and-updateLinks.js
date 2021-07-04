'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.dropTable('updatePics');
		await queryInterface.dropTable('updateLinks');
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
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
			description: {
				type: Sequelize.TEXT
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

		await queryInterface.createTable('updateLinks', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			updateId: {
				type: Sequelize.INTEGER
			},
			url: {
				type: Sequelize.TEXT
			},
			title: {
				type: Sequelize.TEXT
			},
			description: {
				type: Sequelize.TEXT
			},
			siteName: {
				type: Sequelize.TEXT
			},
			image: {
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
	}
};
