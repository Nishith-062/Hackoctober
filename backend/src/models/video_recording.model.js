import mongoose from "mongoose";

const Video_RecordingSchema=new mongoose.Schema(
     {
    recording_sid: {
      type: String,
      required: true,
      trim: true,
    },
    recording_url: {
      type: String,
      required: true,
      trim: true,
    },
    file_path: {
      type: String,
      default: null,
    },
    record_started_at: {
      type: Date,
      default: null,
    },
    record_ended_at: {
      type: Date,
      default: null,
    },
    duration_seconds: {
      type: Number,
      default: 0,
    },
    file_size_bytes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview_session",
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
)

const Video_Recording= mongoose.model("Video_Recording",Video_RecordingSchema);
export default Video_Recording;