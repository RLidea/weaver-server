'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class apiDocument extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  apiDocument.init({
    version: DataTypes.STRING,
    content: DataTypes.STRING,
    memo: DataTypes.STRING,
    isUse: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'apiDocument',
    timestamps: true,
  });
  return apiDocument;
};
