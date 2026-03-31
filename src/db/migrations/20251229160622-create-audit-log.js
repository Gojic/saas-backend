'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuditLogs', {
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
        onDelete: 'RESTRICT'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      entityType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      meta: {
        type: Sequelize.JSON,
        allowNull: true,
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
    await queryInterface.addIndex('AuditLogs', ['orgId', 'createdAt'], {
      name: 'idx_auditlogs_orgid_createdat',
    });

    await queryInterface.addIndex('AuditLogs', ['orgId', 'entityType', 'entityId'], {
      name: 'idx_auditlogs_orgid_entity',
    });

    await queryInterface.addIndex('AuditLogs', ['orgId', 'userId', 'createdAt'], {
      name: 'idx_auditlogs_orgid_userid_createdat',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AuditLogs');
  }
};