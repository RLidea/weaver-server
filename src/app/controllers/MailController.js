const nodemailer = require('nodemailer');
const sendmail = require('sendmail')();

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
    user: process.env.NODE_ENV === 'production' ? process.env.MAIL_USER : process.env.MAIL_DEV_USER,
    pass: process.env.NODE_ENV === 'production' ? process.env.MAIL_PASSWORD : process.env.MAIL_DEV_PASSWORD,
  },
};

controllers.send = (req, res, next) => {
  const isDevMailUserExist = process.env.NODE_ENV === 'development'
    && process.env.MAIL_DEV_USER
    && process.env.MAIL_DEV_PASSWORD;
  const isMailUserExist = process.env.NODE_ENV === 'production'
    && process.env.MAIL_USER
    && process.env.MAIL_PASSWORD;

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
    from: mailOptions.from || `${process.env.APP_NAME.toLowerCase()}@${process.env.APP_NAME.toLowerCase()}.com`,
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
