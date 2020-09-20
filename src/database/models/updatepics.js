'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class updatePics extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	updatePics.init(
		{
			updateId: DataTypes.INTEGER,
			publicId: DataTypes.STRING,
			width: DataTypes.INTEGER,
			height: DataTypes.INTEGER,
			mimetype: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'updatePics'
		}
	);
	return updatePics;
};
