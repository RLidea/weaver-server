const Model = require('./../../app/models');
const MenuModel = Model.menu;
// const AuthorityMenuRelationModel = Model.authority_menu_relation;

module.exports.menuList = async menus_id => {
  const menus = await getAllMenuList();
  console.log(JSON.stringify(createMenuTree(menus, menus_id))); // menus_id: origin_id
  return createMenuTree(menus, menus_id)[0].children;
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

function createMenuTree(menus, menu_id) {
  let result = [];
  const master_menu_id = menu_id;

  for (let i in menus) {
    const menu = menus[i];
    const item = {
      id: menu.id,
      parent_id: menu.parent_id,
      name: menu.name,
      uri: menu.uri,
      children: [],
    };

    // create root node
    if (menu.parent_id == 0 && menu.id == master_menu_id) {
      result.push(item);
      continue;
    }

    // create another nodes
    result = recursiveSearch(result, item);
  }
  return result;
}

const recursiveSearch = (parents, child) => {
  for (let i in parents) {
    const parent = parents[i];
    console.log(parent, child);
    if (parent.id == child.parent_id) {
      parent.children.push(child);
    }
  }
  console.log('########');
  console.log(parents);
  return parents;
};
