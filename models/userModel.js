const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      default: "user"
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost"
      }
    ],
    resumes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
