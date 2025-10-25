import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    technical_skills: {
      type: String,
      required: true,
    },
    problem_solving: {           
      type: String,
      required: true,
    },
    communication: {
      type: String,
      required: true,
    },
    overall_comments: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    interviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",              
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }          
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
