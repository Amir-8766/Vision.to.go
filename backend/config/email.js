const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email verification function
const sendVerificationEmail = async (email, verificationToken) => {
  const backendBase = process.env.BACKEND_URL || "https://api.thegrrrlsclub.de";
  const verificationUrl = `${backendBase}/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - The Girl's Club",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DE5499;">Welcome to The Girl's Club!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="background-color: #DE5499; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendBase}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password - The Girl's Club",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DE5499;">Password Reset</h2>
        <p>Click the button below to set a new password:</p>
        <a href="${resetUrl}" 
           style="background-color: #DE5499; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link expires in 1 hour.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendVerificationEmail, sendPasswordResetEmail };
