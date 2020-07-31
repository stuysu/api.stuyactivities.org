'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
	class charterComments extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */

		static associate(models) {
			// define association here
		}
	}
	charterComments.init(
		{
			organizationId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			comment: DataTypes.TEXT,
			seen: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'charterComments'
		}
	);
	return charterComments;
};
