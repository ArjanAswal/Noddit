const nodemailer = require('nodemailer');
const pug = require('pug');
const {htmlToText} = require('html-to-text');

module.exports = class Email {
  to;
  username;
  url;
  from;
  constructor(user, url) {
    this.to = user.email;
    this.username = user.username;
    this.url = url;
    this.from =
        `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`;
  }

  createNewTransporter() {
    return nodemailer.createTransport({
      service : 'SendGrid',
      auth : {
        user : process.env.SENDGRID_USERNAME,
        pass : process.env.SENDGRID_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      username : this.username,
      url : this.url,
      subject,
    });

    const mailOptions = {
      from : this.from,
      to : this.to,
      subject,
      html,
      text : htmlToText(html),
    };

    await this.createNewTransporter().sendMail(mailOptions);
  }

  async sendWelcome() { await this.send('welcome', 'Welcome to Noddit!'); }

  async sendPasswordReset() {
    await this.send('passwordReset',
                    'Reset your password (valid for 10 minutes)');
  }
};
