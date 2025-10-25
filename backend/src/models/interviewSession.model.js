import mongoose from "mongoose";

const Interview_sessionSchema=new mongoose.Schema({
    room_name: {
      type: String,
      required: true,
      trim: true,
    },
    room_sid: {
      type: String,
      required: true,
      trim: true,
    },
    participant_token: {
      type: String,
      required: true,
    },
    participant_identity: {
      type: String,
      required: true,
    },
    started_at: {
      type: Date,
      default: null,
    },
    ended_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    interview_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
)

const Interview_session=mongoose.model("Interview_session",Interview_sessionSchema);
export default Interview_session;



