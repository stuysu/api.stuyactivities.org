'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
import findManyLoader from '../dataloaders/findManyLoader';

const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class meetings extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			meetings.belongsTo(models.organizations);
			meetings.belongsTo(models.groups);
			meetings.belongsToMany(models.rooms, {
				through: models.meetingRooms
			});
		}

		static orgIdUpcomingLoader = findManyLoader(
			meetings,
			'organizationId',
			{
				start: {
					[Op.gt]: new Date()
				}
			}
		);
		static orgIdLoader = findManyLoader(meetings, 'organizationId');
		static idLoader = findOneLoader(meetings, 'id');
	}
	meetings.init(
		{
			organizationId: DataTypes.INTEGER,
			title: DataTypes.STRING,
			description: DataTypes.TEXT,
			start: DataTypes.DATE,
			privacy: DataTypes.ENUM('public', 'private'),
			groupId: DataTypes.INTEGER,
			end: DataTypes.DATE
		},
		{
			sequelize,
			modelName: 'meetings'
		}
	);
	return meetings;
};
