const Model = require('@models');

const MenuModel = Model.menu;
const formatter = require('@utils/formatter');
const LanguageController = require('./LanguageController');

/**
 * 메뉴 카테고리에 해당하는 메뉴를 트리 구조로 출력한다.
 * @param menu_categories_id
 * @returns {Promise<number[]|SamplingHeapProfileNode[]|NodeModule[]|NodeJS.Module[]|{enumerable: boolean}|HTMLCollection|*>}
 */
module.exports.menuList = async (menu_categories_id, language_code) => {
  const menus = await getMenuList(menu_categories_id, language_code);
  return formatter.list_to_tree(menus);
};

/**
 * 특정 카테고리의 메뉴들을 order ASC 순으로 정렬해서 리스트로 가져온다.
 * @param menu_categories_id
 * @returns {Promise<T>}
 */
const getMenuList = async (menu_categories_id, language_code) => {
  // TODO: user 정보 받아서 권한이 있는 메뉴만 출력

  const languages_id = await LanguageController.getLanguagesId(language_code);

  const menus = await MenuModel.findAll({
    include: [
      {
        model: Model.menu_translation,
        where: {
          languages_id,
        },
      },
    ],
    where: { menu_categories_id },
    order: [['order', 'ASC']],
  }).then((menuData) => menuData.map((menu) => {
    return {
      id: menu.dataValues.id,
      name: menu.dataValues.menu_translations[0].name,
      parent_id: menu.dataValues.parent_id,
      menu_categories_id: menu.dataValues.menu_categories_id,
      uri: menu.dataValues.uri,
      depth: menu.dataValues.depth,
      order: menu.dataValues.order,
      description: menu.dataValues.description,
      is_use: menu.dataValues.description,
    };
  }));

  return menus;
};
