const nodemailer = require('nodemailer');
const sendmail = require('sendmail')();
const config = require('@root/src/config');

const controllers = {};

class MailOptions {
  constructor({ to, subject, text }) {
    this.from = mailConfig.auth.user;
    this.to = to;
    this.subject = subject;
    this.text = text;
  }
}

const mailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.env.NODE_ENV === 'production' ? config.email.MAIL_USER : config.email.MAIL_DEV_USER,
    pass: config.env.NODE_ENV === 'production' ? config.email.MAIL_PASSWORD : config.email.MAIL_DEV_PASSWORD,
  },
};

controllers.send = (req, res) => {
  const isDevMailUserExist = config.env.NODE_ENV === 'development'
    && config.email.MAIL_DEV_USER
    && config.email.MAIL_DEV_PASSWORD;
  const isMailUserExist = config.env.NODE_ENV === 'production'
    && config.email.MAIL_USER
    && config.email.MAIL_PASSWORD;

  if (isMailUserExist || isDevMailUserExist) {
    return sendWithSMTP(req, res);
  }

  return sendWithOutSMTP(req, res);
};

const sendWithSMTP = (req, res) => {
  const mailOptions = new MailOptions(req.body);

  const transporter = nodemailer.createTransport(mailConfig);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // if using Gmail, check this: https://myaccount.google.com/lesssecureapps
      global.logger.error(`${error.message}`);
      return global.message.badRequest(res, 'email sent failed', error.message);
    }
    global.logger.dev(`Email sent: ${info.response}`);
    return global.message.ok(res, 'email sent successfully', mailOptions);
  });
};

const sendWithOutSMTP = (req, res) => {
  const mailOptions = new MailOptions(req.body);
  sendmail({
    from: mailOptions.from || `${config.env.APP_NAME.toLowerCase()}@${config.env.APP_NAME.toLowerCase()}.com`,
    to: mailOptions.to,
    subject: mailOptions.subject,
    html: mailOptions.text,
  }, (error, reply) => {
    if (error) global.logger.error(error && error.stack);
    global.logger.dev(reply);
  });
  return global.message.ok(res, 'email sent successfully', {});
};

module.exports = controllers;
