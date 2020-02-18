'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'menus',
      [
        {
          id: 1,
          parent_id: 0,
          // name: 'Admin Settings',
          uri: '/admin/settings',
          menu_categories_id: 1,
          depth: 1,
          order: 99,
          description: 'Admin Page Default Setting Page',
          is_use: true,
        },
        {
          id: 2,
          parent_id: 0,
          // name: 'Dashboard',
          uri: '/admin/dashboard',
          menu_categories_id: 1,
          depth: 1,
          order: 1,
          description: 'Admin Page Dashboard',
          is_use: true,
        },
        {
          id: 3,
          parent_id: 0,
          // name: 'Manage Users',
          uri: '/admin/users',
          menu_categories_id: 1,
          depth: 1,
          order: 2,
          description: 'Admin Page User Management',
          is_use: true,
        },
        {
          id: 4,
          parent_id: 0,
          uri: '/admin/boards',
          menu_categories_id: 1,
          depth: 1,
          order: 3,
          description: 'Boards List',
          is_use: true,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('menus', null, {});
  },
};
