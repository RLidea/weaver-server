module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
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
      profileImageUrl: {
        type: Sequelize.TEXT,
        comment: '프로필 이미지 파일의 url',
      },
      profileThumbnailUrl: {
        type: Sequelize.TEXT,
        comment: '썸네일 이미지의 url',
      },
      phone: {
        type: Sequelize.CHAR,
        comment: '전화번호',
      },
      certificationDate: {
        type: Sequelize.DATE,
        comment: '인증 날짜',
      },
      lastLogin: {
        type: Sequelize.DATE,
        comment: '최종 로그인 날짜',
      },
      salt: {
        allowNull: false,
        type: Sequelize.STRING(191),
        comment: '암호화 보안을 위한 salt',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
