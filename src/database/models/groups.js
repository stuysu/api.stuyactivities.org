'use strict';
const {
  Model
} = require('sequelize');
import findManyLoader from '../dataloaders/findManyLoader';
import findOneLoader from '../dataloaders/findOneLoader';

module.exports = (sequelize, DataTypes) => {
  class groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
	  groups.belongsTo(models.organizations);
	  groups.hasMany(models.groupMemberships);
    }
	static idLoader = findOneLoader(groups, 'id');
	static orgIdLoader = findManyLoader(groups, 'organizationId');

  };
  groups.init({
    name: DataTypes.STRING,
    organizationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'groups',
  });
  return groups;
};