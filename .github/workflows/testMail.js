// smtp-test.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@coneypower.com', // This should be a Zoho email, not Gmail!
    pass: 'C2-r!vE_bX_TJ7b'
  }
});

transporter.sendMail({
  from: '"Test" <admin@coneypower.com>',
  to: 'candminnovators@gmail.com',
  subject: 'SMTP Test',
  text: 'This is a test email.'
}, (err, info) => {
  if (err) {
    return console.error('Error:', err);
  }
  console.log('Email sent:', info.response);
});