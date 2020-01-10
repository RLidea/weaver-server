const AuthController = require('./auth/AuthController');
const CommonCodeModel = require('./../../app/models').common_code;
const Schema = require('validate');

// const isAdmin = () => {
//   // return true;
//   console.log('hey');
// };

const viewDashboard = (req, res, next) => {
  const isAuthorized = AuthController.isAuthorized(req, res, next);
  res.render('admin/dashboard', {
    title: process.env.APP_NAME,
    isAuthorized: isAuthorized.toString(),
    csrfToken: req.csrfToken(),
  });
};

const viewSetting = async (req, res, next) => {
  const systemMetadata = await CommonCodeModel.findAll({
    where: {
      group_codes_id: 1,
    },
  }).then(r =>
    r.map(data => {
      return {
        name: data.dataValues.name,
        data: data.dataValues.data,
        description: data.dataValues.description,
      };
    }),
  );
  const isAuthorized = AuthController.isAuthorized(req, res, next);

  res.render('admin/settings', {
    title: process.env.APP_NAME,
    isAuthorized: isAuthorized.toString(),
    csrfToken: req.csrfToken(),
    systemMetadata: systemMetadata,
  });
};

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
  for (let i in keys) {
    await CommonCodeModel.findOne({ where: { name: keys[i] } }).then(metadata => {
      if (!metadata) return false;
      metadata.update({ data: parameters[keys[i]] });
    });
  }

  res.redirect('/admin/settings');
};

module.exports = Object.assign(
  {},
  {
    viewDashboard,
    viewSetting,
    updateSettings,
  },
);
