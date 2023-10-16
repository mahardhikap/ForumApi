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

const sendOTP = async (email_client, name, code) => {
  let mailOption = {
    from: `"Forum" <${process.env.EMAIL_NAME}>`,
    to: email_client,
    subject: `Change Password Forum`,
    html: `
    <div style="margin: 50px auto; width: 300px; background-color: #A9A9A9; padding: 15px;border-radius: 15px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5); font-size:larger;">
    <h1 style="text-align: center;">Forum</h1>
    <h3>Hello, <b>${name}</b></h3>
    <p>Have you requested a password reset for your account at <strong>Web Forum</strong>? Don't give this code to anyone:</p>
    <div style="background-color: #36454F; border-radius: 10px;padding: 10px; color: white;">${code}</div>
    <p>If you feel that you have not requested to reset your account password, please ignore this email.</p>
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

module.exports = sendOTP;