'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(t => {
			return Promise.all([
				queryInterface.addColumn(
					'sales',
					'purchaserOsis',
					{
						type: Sequelize.DataTypes.INTEGER
					},
					{ transaction: t }
				),
				queryInterface.addColumn(
					'sales',
					'recorderId',
					{
						type: Sequelize.DataTypes.INTEGER
					},
					{ transaction: t }
				)
			]);
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(t => {
			return Promise.all([
				queryInterface.removeColumn('sales', 'purchaserOsis', {
					transaction: t
				}),
				queryInterface.removeColumn('sales', 'recorderId', {
					transaction: t
				})
			]);
		});
	}
};
