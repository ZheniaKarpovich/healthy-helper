const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport('smtps://<account>%40gmail.com:<password>@smtp.gmail.com');

const senderAddress = '"From your mom with love" <mom@gmail.com>';

const sendUserActivationEmail = async (email, origin, activationCode) => {
  const url = `${origin}/activate?code=${activationCode}`;

  const mailOptions = {
    from: senderAddress,
    to: email,
    subject: 'Account activation',
    html: `<div>${url}</div>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendForgotPasswordEmail = async (email, origin, passwordResetCode) => {
  const url = `${origin}/reset?code=${passwordResetCode}`;

  const mailOptions = {
    from: senderAddress,
    to: email,
    subject: 'Reset your Password',
    html: `<div>${url}</div>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendForgotPasswordEmail,
  sendUserActivationEmail,
};