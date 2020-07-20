'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class organizationTags extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			organizationTags.belongsTo(models.organizations);
			organizationTags.belongsTo(models.tags);
		}
	}
	organizationTags.init(
		{
			organizationId: DataTypes.INTEGER,
			tagId: DataTypes.INTEGER
		},
		{
			sequelize,
			modelName: 'organizationTags'
		}
	);
	return organizationTags;
};
