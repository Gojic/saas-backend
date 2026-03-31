'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Org extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Org.belongsToMany(models.User, {
        through: models.OrgMember,
        foreignKey: 'orgId',
        otherKey: 'userid',
        as: 'users',
      });
      Org.hasMany(models.OrgMember, { foreignKey: 'orgId', as: 'members' });


      Org.hasMany(models.Project, { foreignKey: 'orgId', as: 'projects' });

      Org.hasMany(models.Documents, { foreignKey: 'orgId', as: 'documents' });

      Org.hasMany(models.Invite, { foreignKey: 'orgId', as: 'invites' });

      Org.hasOne(models.BillingCustomer, { foreignKey: 'orgId', as: 'billing' });

      Org.hasMany(models.AuditLog, { foreignKey: 'orgId', as: 'auditLogs' });
    }
  }
  Org.init({
    name: DataTypes.STRING,
    plan: DataTypes.STRING,
    seatsAllowed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Org',
    tableName: 'Orgs',
  });
  return Org;
};