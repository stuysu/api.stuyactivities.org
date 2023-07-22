'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		return queryInterface.sequelize.transaction(t => {
			return Promise.all([
				queryInterface.addColumn(
					'charters',
					'returningInfo',
					{
						type: Sequelize.DataTypes.TEXT
					},
					{ transaction: t }
				),
				queryInterface.addColumn(
					'charterEdits',
					'returningInfo',
					{
						type: Sequelize.DataTypes.TEXT
					},
					{ transaction: t }
				)
			]);
		});
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(t => {
			return Promise.all([
				queryInterface.removeColumn('charters', 'returningInfo', {
					transaction: t
				}),
				queryInterface.removeColumn('charterEdits', 'returningInfo', {
					transaction: t
				})
			]);
		});
	}
};
