'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      users_id: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
      },
      articles_id: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'articles',
          },
          key: 'id',
        },
      },
      parent_id: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
        references: {
          model: {
            tableName: 'comments',
          },
          key: 'id',
        },
      },
      depth: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      content: {
        type: Sequelize.STRING(191),
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comments');
  },
};
