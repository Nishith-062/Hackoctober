import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure transporter (move credentials to .env for safety)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "omkarbiradar266@gmail.com",
    pass: process.env.EMAIL_PASS || "anpt tvua bvwi qexk", // fallback for local testing
  },
});


export const sendInterviewScheduleMail = async (
  to,
  name,
  title,
  description,
  scheduled_at,
  duration_minutes,
  interviewer_name
) => {
  const mailOptions = {
    from: "omkarbiradar266@gmail.com",
    to,
    subject: `Interview Scheduled: ${title}`,
    html: `
      <h2>Hi ${name},</h2>
      <p>Your interview has been successfully scheduled. Here are the details:</p>

      <table style="border-collapse: collapse; margin-top: 10px;">
        <tr><td><strong>Title:</strong></td><td>${title}</td></tr>
        <tr><td><strong>Description:</strong></td><td>${description}</td></tr>
        <tr><td><strong>Scheduled Date & Time:</strong></td><td>${scheduled_at}</td></tr>
        <tr><td><strong>Duration:</strong></td><td>${duration_minutes} minutes</td></tr>
        <tr><td><strong>Interviewer:</strong></td><td>${interviewer_name}</td></tr>
      </table>

      <br/>
      <p>You can join your interview using this link:</p>
      <p><a href="url" target="_blank">Join Interview</a></p>

      <br/><br/>
      <p>Please ensure you join on time and have a stable internet connection.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Interview schedule email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};
