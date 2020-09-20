'use strict';
import findOneLoader from '../dataloaders/findOneLoader';
import findManyLoader from '../dataloaders/findManyLoader';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class updates extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			updates.belongsTo(models.organizations);
			updates.belongsTo(models.users, { foreignKey: 'submittingUserId' });
			updates.hasMany(models.updateLinks);
			updates.hasMany(models.updatePics);
			updates.hasMany(models.updateApprovalMessages);
		}

		static idLoader = findOneLoader(updates);
		static userIdLoader = findManyLoader(updates, 'submittingUserId');
		static orgIdLoader = findManyLoader(updates, 'organizationId');
	}
	updates.init(
		{
			organizationId: DataTypes.INTEGER,
			submittingUserId: DataTypes.INTEGER,
			title: DataTypes.TEXT,
			content: DataTypes.TEXT,
			type: DataTypes.ENUM('private', 'public'),
			approved: DataTypes.BOOLEAN,
			localPinned: DataTypes.BOOLEAN,
			globalPinned: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'updates'
		}
	);
	return updates;
};
