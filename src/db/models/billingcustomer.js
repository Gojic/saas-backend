'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BillingCustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BillingCustomer.belongsTo(models.Org, { foreignKey: 'orgId', as: 'org' });
    }
  }
  BillingCustomer.init({
    orgId: DataTypes.INTEGER,
    stripeCustomerId: DataTypes.STRING,
    stripeSubscriptionId: DataTypes.STRING,
    plan: DataTypes.STRING,
    seats: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BillingCustomer',
    tableName: 'BillingCustomers',
  });
  return BillingCustomer;
};