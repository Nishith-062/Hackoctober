// models/TestCase.js
import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  problem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  input: { type: [mongoose.Schema.Types.Mixed], required: true },
  output: { type: mongoose.Schema.Types.Mixed, required: true },
  is_hidden: { type: Boolean, default: false },
});

export default mongoose.model("TestCase", testCaseSchema);
