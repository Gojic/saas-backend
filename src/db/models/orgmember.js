'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrgMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrgMember.belongsTo(models.Org, { foreignKey: 'orgId', as: 'org' });
      OrgMember.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

    }
  }
  OrgMember.init({
    orgId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrgMember',
    tableName: 'OrgMembers',
  });
  OrgMember.addScope('tenant', (orgId) => ({
    where: { orgId }
  }));
  return OrgMember;
};