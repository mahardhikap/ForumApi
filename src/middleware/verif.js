const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'mail.project13.my.id',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email_client, name, url, code) => {
  let mailOption = {
    from: `"Forum" <${process.env.EMAIL_NAME}>`,
    to: email_client,
    subject: `Forum Confirmation`,
    html: `
    <div style="margin: 50px auto; width: 300px; background-color: #A9A9A9; padding: 15px;border-radius: 15px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5); font-size:larger;">
    <h1 style="text-align: center;">Forum</h1>
    <h3>Hello, <b>${name}</b></h3>
    <p>Registration at <strong>Web Forum</strong> was successful, here is the code to activate your email, don't give this code to anyone:</p>
    <div style="background-color: #36454F; border-radius: 10px;padding: 10px; color: white;">${code}</div>
    <p>Or you can click this link to activating your email ${url}.</p>
    <p>If you feel you have not registered for our application/web service, please ignore this email.</p>
    <br>
    <p>Best regards,</p>
    <strong>Mahardhika Putra Pratama</strong>
    <p style="padding: 0;margin: 0;">(Administrator)</p>
    </div>
        `,
  };

  try {
    let info = await transporter.sendMail(mailOption);
    console.log('Email sent:', info.response);
    return info.response;
  } catch (error) {
    console.log('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;