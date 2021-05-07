'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class meetingRooms extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	meetingRooms.init(
		{
			meetingId: DataTypes.INTEGER,
			roomId: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'meetingRooms'
		}
	);
	return meetingRooms;
};
