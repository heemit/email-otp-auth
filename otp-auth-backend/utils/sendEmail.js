const nodemailer = require('nodemailer')

// Configure transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

module.exports = async function sendEmail(to, otp) {
  const mailOptions = {
    from: '"OTP Auth" <mern.project16010122@gmail.com>',
    to,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Login Verification</h2>
        <p>Your OTP code is:</p>
        <h3 style="color: #1d4ed8;">${otp}</h3>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`📩 OTP sent to ${to}`)
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw new Error('Email sending failed')
  }
}
