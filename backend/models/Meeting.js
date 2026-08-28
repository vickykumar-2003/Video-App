import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    roomId: { type: String, required: true, unique: true, uppercase: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    scheduledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

meetingSchema.index({ host: 1, createdAt: -1 });

export default mongoose.model("Meeting", meetingSchema);
