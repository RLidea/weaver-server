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
    url: {
      type: String,
      required: true,
    },
    string: {
      type: String,
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
  },
};

const errorMessage = validationError => {
  return { error: true, message: validationError[0].message };
};

module.exports = {
  check,
  errorMessage,
};
