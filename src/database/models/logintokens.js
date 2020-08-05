import { Model } from 'sequelize';
import findOneLoader from '../dataloaders/findOneLoader';
import findManyLoader from '../dataloaders/findManyLoader';

module.exports = (sequelize, DataTypes) => {
	class loginTokens extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			loginTokens.belongsTo(models.users);
		}

		static tokenLoader = findOneLoader(loginTokens, 'token');
		static idLoader = findOneLoader(loginTokens, 'id');
		static userIdLoader = findManyLoader(loginTokens, 'userId');

		isValid() {
			if (this.used) {
				return false;
			}

			const now = new Date();
			const thirtyMinutes = 1000 * 60 * 30;

			const timeSinceCreated = now.getTime() - this.createdAt.getTime();

			return timeSinceCreated < thirtyMinutes;
		}
	}
	loginTokens.init(
		{
			userId: DataTypes.INTEGER,
			token: DataTypes.STRING,
			used: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'loginTokens'
		}
	);
	return loginTokens;
};
