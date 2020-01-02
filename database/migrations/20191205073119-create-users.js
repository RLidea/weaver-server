'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      authorities_id: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      id_name: {
        unique: true,
        type: Sequelize.STRING(191),
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(191),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(191),
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(191),
      },
      files_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'files',
          },
          key: 'id',
        },
      },
      phone: {
        type: Sequelize.CHAR(13),
      },
      mobile: {
        type: Sequelize.CHAR(13),
      },
      fax: {
        type: Sequelize.CHAR(13),
      },
      wechat_id: {
        type: Sequelize.STRING(50),
      },
      certicifation_data: {
        type: Sequelize.STRING(191),
      },
      last_login: {
        type: Sequelize.DATE,
      },
      salt: {
        type: Sequelize.STRING(191),
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
    return queryInterface.dropTable('users');
  },
};
