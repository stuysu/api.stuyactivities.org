'use strict';
import { Model } from 'sequelize';
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';
module.exports = (sequelize, DataTypes) => {
	class oAuthIds extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			oAuthIds.belongsTo(models.users, { foreignKey: 'userId' });
		}

		static userIdLoader = findManyLoader(oAuthIds, 'userId');
		static idLoader = findOneLoader(oAuthIds, 'id');
	}
	oAuthIds.init(
		{
			userId: DataTypes.INTEGER,
			platform: DataTypes.ENUM('google', 'microsoft'),
			platformId: DataTypes.STRING,
			platformEmail: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'oAuthIds'
		}
	);
	return oAuthIds;
};
