const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    publicId: {
      type: String, 
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
