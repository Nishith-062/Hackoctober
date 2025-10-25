import Interview from "../models/Interview.js";
import User from "../models/User.js";
import ProblemSet from "../models/ProblemSet.js";
import { getAuth } from "@clerk/express";
// Schedule a new interview
export const scheduleInterview = async (req, res) => {
  try {
    const { userId } = getAuth(req);
       let user = await User.findOne({ clerkId: userId });
    const {
      title,
      scheduled_at,
      duration_minutes,
      programming_language,
      difficulty_level,
      candidate_email,
      problem_set_id,
    } = req.body;

    if (
      !title ||
      !scheduled_at ||
      !duration_minutes ||
      !programming_language ||
      !difficulty_level ||
      !candidate_email ||
      !problem_set_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const interviewer = await User.findById(user);
    if (!interviewer || interviewer.role !== "interviewer") {
      return res.status(403).json({ message: "Only interviewers can schedule interviews" });
    }

    const candidate = await User.findOne({ email: candidate_email, role: "candidate" });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const problemSet = await ProblemSet.findById(problem_set_id);
    if (!problemSet) {
      return res.status(404).json({ message: "Problem set not found" });
    }


    const interview = await Interview.create({
      title,
      scheduled_at,
      duration_minutes,
      programming_language,
      difficulty_level,
      status: "scheduled",
      interviewer_id: interviewer._id,
      candidate_id: candidate._id,
      problem_set_id: problemSet._id,
    });
    // 6️⃣ Return success response
    res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// get interviews
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find();
    const interviewsWithCandidate = await Promise.all(
      interviews.map(async (interview) => {
        const candidate = await User.findOne({ email: interview.candidate_email });
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
