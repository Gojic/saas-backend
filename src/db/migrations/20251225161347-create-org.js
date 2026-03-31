'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orgs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      plan: {
        type: Sequelize.ENUM('free', 'pro'),
        allowNull: false,
        defaultValue: 'free'
      },
      seatsAllowed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3
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
    await queryInterface.dropTable('Orgs');
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS `enum_Orgs_plan`;");
  }
};