const Model = require('./../../app/models');
const MenuModel = Model.menu;
const formatter = require('./../utils/formatter');
// const AuthorityMenuRelationModel = Model.authority_menu_relation;

module.exports.menuList = async menus_id => {
  const menus = await getAllMenuList();
  return getOneMenuList(formatter.list_to_tree(menus), menus_id).children;
};

const getAllMenuList = async () => {
  const menus = await MenuModel.findAll({
    order: [['order', 'ASC']],
  }).then(menus =>
    menus.map(menu => {
      return menu.dataValues;
    }),
  );

  return menus;
};

function getOneMenuList(menus, master_menu_id) {
  let result;
  for (let i = 0, l = menus.length; i < l; i += 1) {
    const data = menus[i];
    if (data.id !== master_menu_id) {
      continue;
    }
    result = data;
  }

  return result;
}
