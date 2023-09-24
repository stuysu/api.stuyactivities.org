'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.changeColumn('organizations', 'locked', {
			type: Sequelize.DataTypes.ENUM('UNLOCK', 'LOCK', 'ADMIN'), // Sequelize coerces data to be strings
			allowNull: false
		});
		await Promise.all([
			queryInterface.bulkUpdate(
				'organizations',
				{ locked: 'UNLOCK' },
				{ locked: '0' }
			),
			queryInterface.bulkUpdate(
				'organizations',
				{ locked: 'LOCK' },
				{ locked: '1' }
			)
		]);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.changeColumn('organizations', 'locked', {
			type: Sequelize.DataTypes.BOOLEAN,
			defaultValue: false
		});
		await Promise.all([
			queryInterface.bulkUpdate(
				'organizations',
				{ locked: false },
				{ locked: 'UNLOCK' }
			),
			queryInterface.bulkUpdate(
				'organizations',
				{ locked: false },
				{ locked: 'ADMIN' }
			),
			queryInterface.bulkUpdate(
				'organizations',
				{ locked: true },
				{ locked: 'LOCK' }
			)
		]);
	}
};
