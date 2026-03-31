'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AuditLog.belongsTo(models.Org, { foreignKey: 'orgId', as: 'org' });
      AuditLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  AuditLog.init({
    orgId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    entityType: DataTypes.STRING,
    entityId: DataTypes.INTEGER,
    meta: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'AuditLogs',
  });
  return AuditLog;
};