'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Invite.belongsTo(models.Org, { foreignKey: 'orgId', as: 'org' });
    }
  }
  Invite.init({
    orgId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    token: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
    acceptedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Invite',
    tableName: 'Invites',
  });
  return Invite;
};