'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          authorities_id: 1,
          id_name: 'dev',
          email: 'dev@weaver.com',
          password: 'secret',
          name: 'Master Developer',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
