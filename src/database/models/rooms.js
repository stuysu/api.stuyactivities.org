import DataLoader from 'dataloader';

('use strict');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class rooms extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			rooms.belongsToMany(models.meetings, {
				through: models.meetingRooms
			});

			this.meetingIdLoader = new DataLoader(async meetingIds => {
				const allRooms = await this.findAll();

				const roomMap = {};

				allRooms.forEach(room => {
					roomMap[room.id] = room;
				});

				const bookedRooms = await models.meetingRooms.findAll({
					where: { meetingId: meetingIds }
				});

				const meetingIdRoomMap = {};

				bookedRooms.forEach(meetingRoom => {
					if (!meetingIdRoomMap[meetingRoom.meetingId]) {
						meetingIdRoomMap[meetingRoom.meetingId] = [];
					}

					meetingIdRoomMap[meetingRoom.meetingId].push(
						roomMap[meetingRoom.roomId]
					);
				});

				return meetingIds.map(
					meetingId => meetingIdRoomMap[meetingId] || []
				);
			});
		}
	}
	rooms.init(
		{
			name: DataTypes.STRING,
			floor: DataTypes.INTEGER,
			approvalRequired: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'rooms'
		}
	);
	return rooms;
};
