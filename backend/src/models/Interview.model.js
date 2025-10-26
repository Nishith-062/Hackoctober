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
    scheduled_at: {
      type: Date,
      required: true,
    },
    duration_minutes: {
      type: Number,
      required: true,
    },
    programming_language: {
      type: String,
      required: true,
    },
    difficulty_level: {
      type: String,
      enum: ["Easy", "Medium", "Hard"], // matches your frontend form
      default: "Easy",
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    candidate_id:{
      type:String,
      required:true
    },
    interviewer_id: {
      type:String,
      required: true,
    },
    problem_set_id: {
      type: Number,
      ref: "Problemset",
      default:1 
    },
    description:{
      type:String
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const Interview = mongoose.model("Interview", InterviewSchema);

export default Interview;
