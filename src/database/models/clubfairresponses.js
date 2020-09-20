'use strict';
import findOneLoader from '../dataloaders/findOneLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class clubFairResponses extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			clubFairResponses.belongsTo(models.organizations);
		}

		static orgIdLoader = findOneLoader(
			clubFairResponses,
			'organizationId',
			{},
			{ sort: [['meetingDay', 'asc']] }
		);

		static idLoader = findOneLoader(clubFairResponses);
	}
	clubFairResponses.init(
		{
			organizationId: DataTypes.INTEGER,
			isAttending: DataTypes.BOOLEAN,
			meetingDay: DataTypes.DATE,
			meetingLink: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'clubFairResponses'
		}
	);
	return clubFairResponses;
};
