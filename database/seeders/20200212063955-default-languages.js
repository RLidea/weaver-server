'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'languages',
      [
        {
          name: 'English',
          code: 'en',
          english: 'english',
          description: '영어',
          is_use: 'Y',
        },
        {
          name: '한국어',
          code: 'ko',
          english: 'korean',
          description: '한국어',
          is_use: 'Y',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('languages', null, {});
  },
};
