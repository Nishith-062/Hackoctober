import express from "express";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
const router = express.Router();

// POST /api/feedback

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "omkarbiradar266@gmail.com",
    pass: process.env.EMAIL_PASS || "anpt tvua bvwi qexk", 
  },
});


export const sendInterviewFeedbackMail = async (
  to,
  technicalSkills,
  problemSolving,
  communication,
  overallComments,
  rating
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Your Interview Feedback`,
    html: `
      <h2>Hi ${ to},</h2>
      <p>Here is the feedback for your recent interview:</p>

      <table style="border-collapse: collapse; margin-top: 10px;">
        <tr><td><strong>Technical Skills:</strong></td><td>${technicalSkills}</td></tr>
        <tr><td><strong>Problem Solving:</strong></td><td>${problemSolving}</td></tr>
        <tr><td><strong>Communication:</strong></td><td>${communication}</td></tr>
        <tr><td><strong>Overall Comments:</strong></td><td>${overallComments}</td></tr>
        <tr><td><strong>Rating:</strong></td><td>${rating}</td></tr>
      </table>

      <br/><br/>
      <p>Thank you for attending the interview. We wish you the best!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Feedback email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send feedback email:", err);
  }
};