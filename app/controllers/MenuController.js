const Model = require('./../../app/models');
const MenuModel = Model.menu;
const MenuTranslationModel = Model.menu_translation;
const formatter = require('./../utils/formatter');
// const AuthorityMenuRelationModel = Model.authority_menu_relation;

/**
 * 메뉴 카테고리에 해당하는 메뉴를 트리 구조로 출력한다.
 * @param menus_id
 * @returns {Promise<number[]|SamplingHeapProfileNode[]|NodeModule[]|NodeJS.Module[]|{enumerable: boolean}|HTMLCollection|*>}
 */
module.exports.menuList = async menus_id => {
  const menus = await getAllMenuList();
  return getOneMenuList(formatter.list_to_tree(menus), menus_id).children;
};

/**
 * 리스트의 모든 정보를 order 순으로 정렬해서 리스트로 가져온다.
 * @returns {Promise<T>}
 */
const getAllMenuList = async () => {
  // TODO: user 정보 받아서 권한이 있는 메뉴만 출력
  const menus = await MenuModel.findAll({
    order: [['order', 'ASC']],
  }).then(menus =>
    menus.map(menu => {
      return menu.dataValues;
    }),
  );

  console.log('#getAllMenuList:');
  console.log(menus);
  return menus;
};

/**
 * 최상단 parent_id 아래로 저장된 메뉴 리스트 하나를 가져온다.
 * @param menus
 * @param category_menu_id
 * @returns {*}
 */
const getOneMenuList = (menus, category_menu_id) => {
  console.log('#getOneMenuList:');
  console.log(menus);
  let result;
  for (let i = 0, l = menus.length; i < l; i += 1) {
    const data = menus[i];
    if (data.id !== category_menu_id) {
      continue;
    }
    result = data;
  }

  console.log('#getOneMenuList result:');
  console.log(result);
  return result;
};

const getTranslation = async menus_id => {
  const translate = MenuTranslationModel.findOne({
    where: {
      menus_id,
    },
  }).then(t => t.dataValues.name);
  return translate;
};
