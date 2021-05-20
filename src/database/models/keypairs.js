'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class keyPairs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	keyPairs.init(
		{
			privateKey: DataTypes.STRING,
			publicKey: DataTypes.STRING,
			passphrase: DataTypes.STRING,
			expiration: DataTypes.DATE
		},
		{
			sequelize,
			modelName: 'keyPairs'
		}
	);
	return keyPairs;
};
