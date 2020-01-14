'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'menus',
      [
        {
          id: 1,
          parent_id: 0,
          name: 'Admin',
          uri: '/admin',
          order: 0,
          description: 'Admin Page Category',
          is_use: 'Y',
        },
        {
          id: 2,
          parent_id: 0,
          name: 'default',
          uri: '/',
          order: 0,
          description: 'Main Page Category',
          is_use: 'Y',
        },
        {
          id: 3,
          parent_id: 1,
          name: 'Admin Settings',
          uri: '/admin/settings',
          order: 99,
          description: 'Admin Page Default Setting Page',
          is_use: 'Y',
        },
        {
          id: 4,
          parent_id: 1,
          name: 'Dashboard',
          uri: '/admin/dashboard',
          order: 1,
          description: 'Admin Page Dashboard',
          is_use: 'Y',
        },
        {
          id: 5,
          parent_id: 1,
          name: 'Manage Users',
          uri: '/admin/users',
          order: 2,
          description: 'Admin Page User Management',
          is_use: 'Y',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('menus', null, {});
  },
};
