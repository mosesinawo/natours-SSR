const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //Activate in gmail "less secure app" option
  });
  //2) Define the email options
  const mailOptions = {
    from: 'Moses Inawo <moses@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html,
  };
  //3) Send the email
  await transporter.sendMail(mailOptions);
  //3)Actually send the email
};
module.exports = sendEmail;

// var transport = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "5b7cb6bb32b812",
//       pass: "56bd9b6b32fed8"
//     }
//   });
