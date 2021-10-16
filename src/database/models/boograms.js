'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class boograms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  boograms.init({
    userId: DataTypes.INTEGER,
    oneDollarCount: DataTypes.INTEGER,
    twoDollarCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'boograms',
  });
  return boograms;
};