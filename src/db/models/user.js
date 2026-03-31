'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Org, {
        through: models.OrgMember,
        foreignKey: 'userId',
        otherKey: 'orgId',
        as: 'orgs'
      });

      User.hasMany(models.OrgMember, { foreignKey: 'userId', as: 'memberships' });


      User.hasMany(models.AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    tokenVersion: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};