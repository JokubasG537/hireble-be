const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  jobPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true
  },
  status: {
    type: String,
    enum: ["applied", "interview", "offer", "rejected"],
    default: "applied"
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);

