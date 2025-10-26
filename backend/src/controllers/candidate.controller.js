import { AccessToken } from "livekit-server-sdk";
import Interview from "../models/Interview.model.js";
import { User } from '../models/user.model.js'
import { getAuth } from "@clerk/express";
export const getInterviewsByCandidateId = async (req, res) => {
  try {
       const { userId } = getAuth(req)
    if (!userId) {
      return res.status(400).json({ message: "Candidate user ID is required" });
    }

    let user= await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(400).json({ message: "Candidate not found" });
    }
    const interviews = await Interview.find({candidate_email:user.email})
      .populate("interviewer_id", "fullName email role")
    if (interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found for this candidate" });
    }
    res.status(200).json({ interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const joinRoom=async (req,res) => {
    const roomName='myroom'
      const at = new AccessToken(
    "APItPrLThLXE95E",
    "jMoEtDq2GE8jdhvzPyNOzXTt9qhpXe0lRdFBWROgTCM",
    {
      identity: 'random',
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
  return res.status(200).json({roomName:'myroom',token:token})
}