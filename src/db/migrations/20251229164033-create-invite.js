'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Orgs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('OWNER', 'ADMIN', 'MEMBER'),
        allowNull: false,
        defaultValue: 'MEMBER',
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      acceptedAt: {
        type: Sequelize.DATE
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
    await queryInterface.addIndex('Invites', ['orgId', 'createdAt'], {
      name: 'idx_invites_orgid_createdat',
    });

    await queryInterface.addIndex('Invites', ['orgId', 'email'], {
      name: 'idx_invites_orgid_email',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invites');
  }
};