const Schema = require('validate');
const Model = require('@models');

const AuthController = require('@controllers/auth/AuthController');
const MenuController = require('@controllers/MenuController');
const UserController = require('@controllers/UserController');
// const BoardController = require('@controllers/BoardController');

const initializeParams = async (req) => {
  const authInfo = await AuthController.getAuthInfo(req, [1, 2]);

  return {
    title: process.env.APP_NAME,
    auth: authInfo,
    csrfToken: req.csrfToken(),
    menus: await MenuController.menuList(1, req.i18n.language),
  };
};

/**
 * Admin DashBoard View
 * @returns {Promise<void>}
 */
const viewDashboard = async (req, res, next) => {
  const init = await initializeParams(req);
  if (init.auth.isAllowed) {
    res.render('admin/dashboard', { ...init, data: await dashboardData() });
  } else {
    res.redirect('/');
  }
};

/**
 * Dashboard 에 출력하는 데이터들을 정리
 * @returns {Promise<{userCount}>}
 */
const dashboardData = async () => {
  const userCount = await UserController.userCount();
  const data = {
    userCount,
  };
  return data;
};

/**
 * Admin System Settings View
 * @returns {Promise<void>}
 */
const viewSetting = async (req, res, next) => {
  const init = await initializeParams(req);
  const systemMetadata = await Model.common_code.findAll({
    where: {
      group_codes_id: 1,
    },
  }).then((r) => r.map((data) => {
    return {
      name: data.dataValues.name,
      data: data.dataValues.data,
      description: data.dataValues.description,
    };
  }));

  res.render('admin/settings', {
    ...init,
    systemMetadata,
  });
};

/**
 * @returns {Promise<Json|any>}
 */
const updateSettings = async (req, res, next) => {
  // Parameters
  const parameters = {
    redirect_uri_after_login: req.body.redirect_uri_after_login,
    redirect_uri_after_register: req.body.redirect_uri_after_register,
    auth_period: req.body.auth_period,
    default_authorities: req.body.default_authorities,
  };

  // validation Check
  const reqBodySchema = new Schema({
    redirect_uri_after_login: {
      type: String,
      required: true,
      length: { min: 1 },
    },
    redirect_uri_after_register: {
      type: 'string',
      required: true,
      length: { min: 1 },
    },
    auth_period: {
      type: 'string',
      required: true,
      length: { min: 1 },
    },
    default_authorities: {
      type: 'string',
      required: true,
      length: { min: 1 },
    },
  });
  const validationError = reqBodySchema.validate(parameters);
  if (validationError.length > 0) {
    return res.status(400).json({ error: true, message: validationError[0].message });
  }

  // Update
  const keys = Object.keys(parameters);
  // eslint-disable-next-line guard-for-in
  for (const i in keys) {
    // eslint-disable-next-line no-await-in-loop
    await Model.common_code.findOne({ where: { name: keys[i] } }).then((metadata) => {
      if (!metadata) return false;
      metadata.update({ data: parameters[keys[i]] });
    });
  }

  res.redirect('/admin/settings');
};

/**
 * User Management View
 * @returns {Promise<void>}
 */
const viewUsers = async (req, res, next) => {
  const init = await initializeParams(req);

  const pageNum = req.body.pageNum > 0 ? req.body.pageNum : 1;

  const users = await UserController.allUsers(pageNum, 2);
  res.render('admin/users', {
    ...init,
    data: users,
  });
};

/**
 * Admin Board Setting View
 * @returns {Promise<void>}
 */
const viewBoards = async (req, res, next) => {
  const init = await initializeParams(req);
  // TODO: get board data
  // const boards = await BoardController.boardList();

  res.render('admin/boards', {
    ...init,
    data: {},
  });
};

module.exports = {
  viewDashboard,
  viewSetting,
  updateSettings,
  viewUsers,
  viewBoards,
};
