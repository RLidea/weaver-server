const Model = require('./../models');

const BoardModel = Model.board;

module.exports.boardList = async () => {
  const boards = await BoardModel.findAll({
    where: {
      is_use: true,
    },
  }).then(board =>
    board.map(item => {
      return item.dataValues;
    }),
  );
  return boards;
};
