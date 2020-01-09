'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'common_codes',
      [
        {
          id: 1,
          group_codes_id: 1,
          parent_id: 0,
          name: 'redirect_uri_after_login',
          data: '/',
          description: 'uri',
        },
        {
          id: 2,
          group_codes_id: 1,
          parent_id: 0,
          name: 'redirect_uri_after_register',
          data: '/',
          description: 'uri',
        },
        {
          id: 3,
          group_codes_id: 1,
          parent_id: 0,
          name: 'redirect_uri_after_admin_login',
          data: '/admin/dashboard',
          description: 'uri',
        },
        {
          id: 4,
          group_codes_id: 1,
          parent_id: 0,
          name: 'default_authorities',
          data: '3',
          description: 'id',
        },
        {
          id: 5,
          group_codes_id: 1,
          parent_id: 0,
          name: 'auth_period',
          data: '3',
          description: 'month',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('common_codes', null, {});
  },
};
