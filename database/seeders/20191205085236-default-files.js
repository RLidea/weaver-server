'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('files', [{
      id: 1,
      type: 'image',
      url: '/public/avatar/default_avatar.png',
      thumbnail_url: '/public/avatar/default_avatar.png'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('files', null, {});
  }
};
