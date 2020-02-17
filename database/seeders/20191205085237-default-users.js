'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          // authorities_id: 1,
          email: 'dev@weaver.com',
          password:
            '1b4ffcb1b8bacb82c29e75fb9c127c9af1fdd7588303e01d69e477de355c708e337f0e204c27e5f2e01c2d6ecca553527b04c3409f5c016d78e71f750524f5ae', // secret
          name: 'Master Developer',
          profile_url: '/public/avatar/default_avatar.png',
          profile_thumbnail_url: '/public/avatar/default_avatar.png',
          salt: '553860772260',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
