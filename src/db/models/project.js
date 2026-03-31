'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.Org, { foreignKey: 'orgId', as: 'org' });

      Project.hasMany(models.Documents, { foreignKey: 'projectId', as: 'documents' });
    }
  }
  Project.init({
    orgId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'Projects',
  });
  return Project;
};