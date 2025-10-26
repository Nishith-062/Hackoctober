// models/ProblemSet.js
import mongoose from "mongoose";

const problemSetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
});


 const ProblemSet=mongoose.model("ProblemSet", problemSetSchema);
export default ProblemSet;
