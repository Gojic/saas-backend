'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Documents.belongsTo(models.Org, { foreignKey: 'orgId', as: 'org' });
      Documents.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
    }
  }
  Documents.init({
    orgId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Documents',
    tableName: 'Documents',
  });
  return Documents;
};