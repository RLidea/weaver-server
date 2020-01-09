'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('common_codes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      group_codes_id: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      parent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      name: {
        type: Sequelize.STRING(191),
      },
      data: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.STRING,
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('common_codes');
  },
};
