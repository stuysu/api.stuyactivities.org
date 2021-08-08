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
			groupMemberships.belongsTo(models.organizations);
			groupMemberships.belongsTo(models.users);
		}
		static idLoader = findOneLoader(groupMemberships, 'id');
		static userIdLoader = findManyLoader(groupMemberships, 'userId');
		static orgIdLoader = findManyLoader(groupMemberships, 'organizationId');
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
