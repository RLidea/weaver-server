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
      // authorities_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER.UNSIGNED,
      // },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(191),
        comment: 'email',
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(191),
        comment: '비밀번호',
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(191),
        comment: '사용자 이름',
      },
      // files_id: {
      //   type: Sequelize.INTEGER.UNSIGNED,
      //   references: {
      //     model: {
      //       tableName: 'files',
      //     },
      //     key: 'id',
      //   },
      //   comment: '프로필 이미지',
      // },
      profile_url: {
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: '/',
        comment: '프로필 이미지 파일의 url',
      },
      profile_thumbnail_url: {
        type: Sequelize.TEXT,
        comment: '썸네일 이미지의 url',
      },
      phone: {
        type: Sequelize.CHAR(13),
        comment: '전화번호',
      },
      certicifation_data: {
        type: Sequelize.STRING(191),
        comment: '인증 날짜',
      },
      last_login: {
        type: Sequelize.DATE,
        comment: '최종 로그인 날짜',
      },
      salt: {
        type: Sequelize.STRING(191),
        comment: '암호화 보안을 위한 salt',
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
