const nodemailer = require('nodemailer');

const controllers = {};

const mailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_ENV === 'production' ? process.env.MAIL_USER : process.env.MAIL_DEV_USER,
    pass: process.env.NODE_ENV === 'production' ? process.env.MAIL_PASSWORD : process.env.MAIL_DEV_PASSWORD,
  },
};

controllers.send = (req, res, next) => {
  class Params {
    constructor({ to, subject, text }) {
      this.from = mailConfig.auth.user;
      this.to = to;
      this.subject = subject;
      this.text = text;
    }
  }

  const mailOptions = new Params(req.body);

  const transporter = nodemailer.createTransport(mailConfig);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // if using Gmail, check this: https://myaccount.google.com/lesssecureapps
      global.logger.error(`${error.message}`);
      return global.message.failed(res, 'email sent failed', error.message);
    }
    global.logger.dev(`Email sent: ${info.response}`);
    return global.message.success(res, 'email sent successfully', mailOptions);
  });
};
module.exports = controllers;
