'use strict';
const { Model } = require('sequelize');
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

module.exports = (sequelize, DataTypes) => {
	class groupMemberships extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			groupMemberships.belongsTo(models.groups);
		}
		static idLoader = findOneLoader(groupMemberships, 'id');
		static groupIdLoader = findManyLoader(groupMemberships, 'groupId');
	}
	groupMemberships.init(
		{
			userId: DataTypes.INTEGER,
			groupId: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'groupMemberships'
		}
	);
	return groupMemberships;
};
