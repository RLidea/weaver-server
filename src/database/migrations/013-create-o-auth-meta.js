'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('oAuthMeta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      usersId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
      },
      service: {
        type: Sequelize.STRING
      },
      accountId: {
        type: Sequelize.STRING
      },
      accessToken: {
        type: Sequelize.STRING
      },
      refreshToken: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('oAuthMeta');
  }
};
