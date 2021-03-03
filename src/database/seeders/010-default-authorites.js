'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'authorities',
      [
        {
          id: 1,
          name: 'Developer',
          description: '개발자 권한. 공개 및 비공개된 모든 서비스의 모든 컨텐츠에 대한 접근 권한을 가진다.',
          isUse: true,
        },
        {
          id: 2,
          name: 'Admin',
          description: '관리자 권한. 공개된 모든 서비스의 공개 및 비공개 컨텐츠에 대한 접근 권한을 가진다.',
          isUse: true,
        },
        {
          id: 3,
          name: 'Member',
          description: '기본 유저 권한. 공개된 모든 서비스의 공개 컨텐츠에 대한 접근 권한을 가진다.',
          isUse: true,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('authorities', null, {});
  },
};
