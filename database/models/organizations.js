'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class organizations extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			organizations.belongsToMany(models.tags, {
				through: models.orgTags
			});

			organizations.hasOne(models.charters);

			organizations.hasMany(models.charterEdits);

			organizations.hasMany(models.memberships);
			organizations.hasMany(models.membershipRequests);
		}
	}
	organizations.init(
		{
			name: DataTypes.STRING,
			url: DataTypes.STRING,
			active: DataTypes.BOOLEAN
		},
		{
			sequelize,
			modelName: 'organizations'
		}
	);
	return organizations;
};
