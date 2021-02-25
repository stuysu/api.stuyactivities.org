'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.sequelize.transaction(async t => {
			await queryInterface.addColumn(
				'memberships',
				'meetingNotification',
				{ type: Sequelize.DataTypes.BOOLEAN },
				{ transaction: t }
			);
			await queryInterface.addColumn(
				'memberships',
				'updateNotification',
				{ type: Sequelize.DataTypes.BOOLEAN },
				{ transaction: t }
			);
			await queryInterface.addColumn(
				'memberships',
				'meetingReminderTime',
				{ type: Sequelize.DataTypes.INTEGER },
				{ transaction: t }
			);
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.sequelize.transaction(async t => {
			await queryInterface.removeColumn(
				'memberships',
				'meetingNotification',
				{ transaction: t }
			);
			await queryInterface.removeColumn(
				'memberships',
				'updateNotification',
				{ transaction: t }
			);
			await queryInterface.removeColumn(
				'memberships',
				'meetingReminderTime',
				{ transaction: t }
			);
		});
	}
};
