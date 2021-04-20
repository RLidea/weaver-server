const fs = require('fs');

const util = {};

/**
 * 자료구조 변환: 리스트 -> 트리
 * @param list
 * @returns {[]}
 */
util.listToTree = list => {
  const map = {};
  const roots = [];

  // initialize
  for (let i = 0, l = list.length; i < l; i += 1) {
    map[list[i].id] = list[i];
    // eslint-disable-next-line no-param-reassign
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

util.toNumber = value => {
  const result = Number(value);
  if (value === null) return null;
  if (Number.isNaN(result)) return undefined;
  return result;
};

/*
 base64 handler
 */
util.imageFileToBase64String = filePath => {
  const buff = fs.readFileSync(filePath);
  return buff.toString('base64');
};

util.base64StringToImageFile = (dataString, filePath) => {
  const buff = Buffer.from(dataString, 'base64');
  fs.writeFileSync(filePath, buff);
  return {
    filePath,
  };
};

module.exports = util;
