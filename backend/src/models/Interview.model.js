import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    candidate_email:{
        type:String,
        required:true
    },
    datetime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    programming_language: {
      type: String,
      required: true,
    },
    difficulty_level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    interviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problemset", 
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const Interview = mongoose.model("Interview", InterviewSchema);

export default Interview;
