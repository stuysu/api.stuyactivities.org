'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
	class passwordResets extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			passwordResets.belongsTo(models.users, { foreignKey: 'userId' });
		}

		isValid() {
			const now = new Date();
			const maxAge = 1000 * 60 * 60;
			const expirationDate = new Date(this.createdAt.getTime() + maxAge);

			return now.getTime() < expirationDate.getTime();
		}
	}
	passwordResets.init(
		{
			userId: DataTypes.INTEGER,
			token: DataTypes.STRING
		},
		{
			sequelize,
			modelName: 'passwordResets'
		}
	);
	return passwordResets;
};
