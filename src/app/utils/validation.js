const Schema = require('validate');
const regex = require('@utils/regex');

const check = {
  auth: {
    email: {
      type: String,
      required: true,
      match: regex.email,
      length: { min: 5 },
      message: 'email_validate',
    },
    password: {
      type: String,
      required: true,
      match: regex.password,
      message: 'password_validate',
    },
    name: {
      type: String,
      required: true,
      length: { min: 1 },
    },
    phone: {
      type: String,
    },
    jwt: {
      type: String,
      required: true,
    },
  },
  common: {
    any: {
      required: false,
    },
    url: {
      type: String,
      required: true,
    },
    string: {
      type: String,
      required: false,
    },
    integer: {
      type: Number,
      required: false,
    },
    reqInteger: {
      type: Number,
      required: true,
    },
    reqString: {
      type: String,
      required: true,
    },
    reqBoolean: {
      type: Boolean,
      required: true,
    },
    reqPositiveInteger: {
      type: Number,
      required: true,
      match: regex.positiveInteger,
    },
  },
};

const errorMessage = validationError => {
  return { error: true, message: validationError[0].message };
};

const validator = (res, params, definition) => {
  const reqBodySchema = new Schema(definition);
  const validationError = reqBodySchema.validate(params);
  return validationError.length > 0 ? {
    message: validationError[0]?.message,
    data: {
      type: 'parameter validation error',
    },
  } : false;
};

module.exports = {
  check,
  errorMessage,
  validator,
};
