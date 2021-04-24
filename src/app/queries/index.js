/* eslint global-require:0 */
/* eslint import/no-dynamic-require:0 */
const fs = require('fs');
const path = require('path');

const Model = require('@models');

const basename = path.basename(__filename);
const queries = {
  sequelize: Model.sequelize,
  Sequelize: Model.Sequelize,
  ...Model.target,
};

fs.readdirSync(__dirname)
  .filter(filename => {
    return filename.indexOf('.') !== 0 && filename !== basename && filename.slice(-3) === '.js';
  })
  .forEach(filename => {
    try {
      const target = filename.replace('.js', '');
      queries[target] = require(`./${target}`);
    } catch (e) {
      global.logger.devError(`🔴 A fatal error has occurred in queries/${filename}`);
      global.logger.devError(e);
      global.logger.error(e.toString());
    }
  });

module.exports = queries;
