import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
	class settings extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {

		}

		static idLoader = findOneLoader(users);
		static emailLoader = findOneLoader(users, 'email');
	}

	settings.init(
		{
            membershipRequirement: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'settings'
		}
	);
	return settings;
};
