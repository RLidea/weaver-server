'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('image', 'document', 'etc'),
        defaultValue: 'etc',
        comment: '파일 타입. 이미지, 문서 등.'
      },
      url: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: '/',
        comment: '파일의 url',
      },
      thumbnail_url: {
        type: Sequelize.TEXT,
        comment: '썸네일 이미지의 url'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        comment: '삭제일'
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('files');
  }
};