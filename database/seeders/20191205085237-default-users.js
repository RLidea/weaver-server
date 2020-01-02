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
          password:
            'b2db999df2a6d3442f2f1991068d4bc9930714a9f668f2e5a1542964701552275ee5f75070601442078dc86ed75aa8fd9d61f031c1a4b6500ced25e415388460', // secret
          name: 'Master Developer',
          salt: '508376146494',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
