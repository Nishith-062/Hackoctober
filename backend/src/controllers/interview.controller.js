import Interview from "../models/Interview.model.js";
import { User } from "../models/user.model.js";
// import {problemSet} from "../models/problem.model.js";
// import ProblemSet from "../models/ProblemSet.model.js";
import ProblemSet from '../models/ProblemSet.model.js'
import { getAuth } from "@clerk/express";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { sendInterviewScheduleMail } from "../config/SendScheduleMail.js";

import { sendInterviewFeedbackMail } from "../config/SendFeedbackMail.js"

// Schedule a new interview
export const scheduleInterview = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const interviewer = await User.findOne({ clerkId: userId });

    if (!interviewer || interviewer.role !== "interviewer") {
      return res.status(403).json({ message: "Only interviewers can schedule interviews" });
    }

    const {
      candidateEmail,
      candidateName,
      date,
      description,
      difficulty,
      duration,
      interviewTitle,
      programmingLanguage,
      time,
    } = req.body;

    console.log(req.body);
  console.log("hello");
  
    const title = interviewTitle;
    const candidate_email = candidateEmail;
    const difficulty_level = difficulty;
    const programming_language = programmingLanguage;
    const scheduled_at = new Date(`${date}T${time}:00Z`);
    const duration_minutes = parseInt(duration);
 console.log("hello");
    if (!title || !scheduled_at || !duration_minutes || !programming_language || !difficulty_level || !candidate_email) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
 console.log("hello");
    const candidate = await User.findOne({ email: candidate_email, role: "candidate" });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
 console.log("hello");
    let problemSet = null;
 console.log("hello");
    const interview = await Interview.create({
      title,
      description,
      scheduled_at,
      duration_minutes,
      programming_language,
      candidate_email,
      difficulty_level,
      interviewer_id: interviewer.clerkId,
      candidate_id: candidate.clerkId,
      problem_set_id: ProblemSet?ProblemSet._id : null,
    });
 console.log("hello");
    // ✅ Send email before responding
    const scheduled_atTime = `${date} ${time}`;
    await sendInterviewScheduleMail(
      candidateEmail,
      candidateName,
      title,
      description,
      scheduled_atTime,
       duration_minutes,
      interviewer.fullName,
    );
 console.log("hello");
    res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    console.error("❌ Error scheduling interview:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get interviews
export const getInterviews = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const interviews = await Interview.find({ interviewer_id: userId });
    const interviewsWithCandidate = await Promise.all(
      interviews.map(async (interview) => {
        const candidate = await User.findOne({
          email: interview.candidate_email,
        });
        return {
          ...interview.toObject(),
          candidate_name: candidate ? candidate.fullName : null,
        };
      })
    );
    res.status(200).json({
      message: "Successfully fetched interviews",
      interviews: interviewsWithCandidate,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const getInterviewDetails = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const totalcount = await Interview.countDocuments({
      interviewer_id: userId,
    });
    const completed = await Interview.countDocuments({
      interviewer_id: userId,
      status: "completed",
    });
    const today = new Date();

    const dayOfWeek = today.getDay() || 7;
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(today.getDate() - dayOfWeek + 1);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    console.log("Week Start:", startDate);
    console.log("Week End:", endDate);
    const currentWeekInterviews = await Interview.countDocuments({
      interviewer_id: userId,
      scheduled_at: { $gte: startDate, $lte: endDate },
    });

    console.log("Interviews this week:", currentWeekInterviews);
    res.status(200).json({
      "Upcoming Interviews": totalcount,
      "This Week": currentWeekInterviews,
      "Total Completed": completed,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

export const CreateRoom = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error("Interview not found");
    }

    interview.status = "in_progress";
    await interview.save();

    const livekitHost = "wss://hackoctober-y7aeqri9.livekit.cloud";
    const roomService = new RoomServiceClient(
      livekitHost,
      "APItPrLThLXE95E",
      "jMoEtDq2GE8jdhvzPyNOzXTt9qhpXe0lRdFBWROgTCM"
    );

    const opts = {
      name: "myroom",
      emptyTimeout: 10 * 60, // 10 minutes
      maxParticipants: 20,
    };
    await roomService.createRoom(opts).then((room) => {
      console.log("room created", room);
    });
    const roomName = "myroom";
    const participantName = "user-name";

    const at = new AccessToken(
      "APItPrLThLXE95E",
      "jMoEtDq2GE8jdhvzPyNOzXTt9qhpXe0lRdFBWROgTCM",
      {
        identity: participantName,
      }
    );

    const videoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    };

    at.addGrant(videoGrant);

    const token = await at.toJwt();
    return res.status(200).json({ roomName: "myroom", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};









// end room

export const EndRoom = async (req, res) => {
  try {
    const { userId } = getAuth(req); // logged-in user


    const roomName="myroom";
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the ongoing interview for this interviewer
    const interview = await Interview.findOne({
      interviewerId: userId,
      status: "in_progress",
    });

    if (!interview) {
      return res.status(404).json({ message: "No ongoing interview found" });
    }

    if (!interview.roomName) {
      return res.status(400).json({ message: "Room name is missing in the interview" });
    }

    // Mark interview as completed
    interview.status = "completed";
    await interview.save();

    // Connect to LiveKit server
    const livekitHost = "wss://hackoctober-y7aeqri9.livekit.cloud";
    const roomService = new RoomServiceClient(
      livekitHost,
      "APItPrLThLXE95E",
      "jMoEtDq2GE8jdhvzPyNOzXTt9qhpXe0lRdFBWROgTCM"
    );

    // Delete the room
    await roomService.deleteRoom(roomName, { force: true });
    console.log(`Room ${roomName} ended successfully`);

    res.status(200).json({ message: "Interview ended and room deleted successfully" });
  } catch (error) {
    console.error("Error ending room:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



export const Feedback = async (req, res) => {
  try {
    const {
      candidate_email,
      technical_skills,
      problem_solving,
      communication,
      overall_comments,
      rating,
    } = req.body;

    await sendInterviewFeedbackMail(
      candidate_email,
      technical_skills,
      problem_solving,
      communication,
      overall_comments,
      rating
    );

    return res.status(200).json({ message: "Feedback email sent successfully!" });
  } catch (e) {
    console.error("❌ Failed to send feedback email:", e);
    return res.status(500).json({ error: "Failed to send feedback email" });
  }
};
