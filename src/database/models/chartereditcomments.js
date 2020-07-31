'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
	class charterEditComments extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			charterEditComments.belongsTo(models.charterEdits, {
				foreignKey: 'charterEditId'
			});

			charterEditComments.belongsTo(models.users, {
				foreignKey: 'userId'
			});
		}
	}
	charterEditComments.init(
		{
			charterEditId: DataTypes.INTEGER,
			userId: DataTypes.INTEGER,
			comment: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'charterEditComments'
		}
	);
	return charterEditComments;
};
