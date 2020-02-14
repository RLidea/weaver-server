'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('languages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(191),
      },
      code: {
        type: Sequelize.STRING(191),
      },
      english: {
        type: Sequelize.STRING(191),
      },
      description: {
        type: Sequelize.STRING(191),
      },
      is_use: {
        allowNull: false,
        type: Sequelize.ENUM('Y', 'N'),
        defaultValue: 'N',
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
    return queryInterface.dropTable('languages');
  },
};