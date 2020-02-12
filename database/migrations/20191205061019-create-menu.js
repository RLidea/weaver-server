'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('menus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      parent_id: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        comment: '상위 메뉴',
        defaultValue: 0,
      },
      // name: {
      //   allowNull: false,
      //   type: Sequelize.STRING(191),
      //   comment: '메뉴 이름',
      // },
      uri: {
        type: Sequelize.STRING(191),
        comment: '메뉴의 uri',
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        comment: '메뉴의 순서',
        defaultValue: 0,
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
    return queryInterface.dropTable('menus');
  },
};
