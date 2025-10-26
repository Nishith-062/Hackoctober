// models/Problem.js
import mongoose from "mongoose";

const initialCodeSchema = new mongoose.Schema({
  javascript: String,
  python3: String,
  cpp: String,
  c: String,
  java: String,
});

const problemSchema = new mongoose.Schema({
  problem_set_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProblemSet",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  initialCode: initialCodeSchema,
  hints: [String],
});

export default mongoose.model("Problem", problemSchema);
