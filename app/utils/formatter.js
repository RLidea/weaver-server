/**
 * 자료구조 변환: 리스트 -> 트리
 * @param list
 * @returns {[]}
 */
module.exports.list_to_tree = list => {
  const map = {};
  const roots = [];

  // initialize
  for (let i = 0, l = list.length; i < l; i += 1) {
    map[list[i].id] = list[i];
    list[i].children = [];
  }

  for (let i = 0, l = list.length; i < l; i += 1) {
    const node = list[i];
    if (node.parent_id !== 0) {
      map[node.parent_id].children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};
