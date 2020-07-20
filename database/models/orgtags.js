'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class orgTags extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			orgTags.belongsTo(models.organizations);
			orgTags.belongsTo(models.tags);
		}
	}
	orgTags.init(
		{
			organizationId: DataTypes.INTEGER,
			tagId: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'orgTags'
		}
	);
	return orgTags;
};
