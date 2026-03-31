'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrgMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orgs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.ENUM('OWNER', 'ADMIN', 'MEMBER'),
        allowNull: false,
        defaultValue: 'MEMBER'
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
    await queryInterface.addConstraint('OrgMembers', {
      fields: ['orgId', 'userId'],
      type: 'unique',
      name: 'uq_orgmembers_orgid_userid'
    });

    await queryInterface.addIndex('OrgMembers', ['orgId'], {
      name: 'idx_orgmembers_orgid',
    });
    await queryInterface.addIndex('OrgMembers', ['userId'], {
      name: 'idx_orgmembers_userid',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('OrgMembers', 'idx_orgmembers_orgid');
    await queryInterface.removeIndex('OrgMembers', 'idx_orgmembers_userid');
    await queryInterface.removeConstraint('OrgMembers', 'uq_orgmembers_orgid_userid');
    await queryInterface.dropTable('OrgMembers');

  }
};