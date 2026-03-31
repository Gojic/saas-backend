'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BillingCustomers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Orgs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      stripeCustomerId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      stripeSubscriptionId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      plan: {
        type: Sequelize.ENUM('free', 'pro'),
        allowNull: false,
        defaultValue: 'free',
      },
      seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BillingCustomers');
  }
};