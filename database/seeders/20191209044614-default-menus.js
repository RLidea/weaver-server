'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'menus',
      [
        {
          id: 1,
          name: 'Admin Settings',
          uri: '/admin/settings',
          order: 0,
          description: 'Admin Page Default Setting Page',
          is_use: 'Y',
        },
        {
          id: 2,
          name: 'Dashboard',
          uri: '/admin/dashboard',
          order: 1,
          description: 'Admin Page Dashboard',
          is_use: 'Y',
        },
        {
          id: 3,
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
