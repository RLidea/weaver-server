const Model = require('./../../app/models');
const MenuModel = Model.menu;
const AuthorityMenuRelationModel = Model.authority_menu_relation;

const viewMenu = (req, res, next) => {
  console.log(req);
};

const menuList = async () => {
  const menus = await MenuModel.findAll({
    order: [['order', 'ASC']],
  }).then(menus =>
    menus.map(menu => {
      return menu.dataValues;
    }),
  );
  console.log(menus);
  return menus;
};
console.log(menuList());
// module.exports = Object.assign(
//   {},
//   {
//     viewMenu,
//   },
// );
