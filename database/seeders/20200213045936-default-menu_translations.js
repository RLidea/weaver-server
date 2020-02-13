'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'menu_translations',
      [
        {
          name: 'Admin Settings',
          menus_id: 1,
          languages_id: 1,
        },
        {
          name: '관리자 설정',
          menus_id: 1,
          languages_id: 2,
        },
        {
          name: 'Dashboard',
          menus_id: 2,
          languages_id: 1,
        },
        {
          name: '대시보드',
          menus_id: 2,
          languages_id: 2,
        },
        {
          name: 'Manage Users',
          menus_id: 3,
          languages_id: 1,
        },
        {
          name: '사용자 관리',
          menus_id: 3,
          languages_id: 2,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('menu_translations', null, {});
  },
};
