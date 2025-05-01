const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    title:
    {
      type: String,
      required: true
    },
    company:
    {
      type: String,
      required: true
    },
    location:
    {
      type: String,
      required: true
    },
    description:
    {
      type: String
    },
    employmentType:
    {
      type: String,
      enum:
      [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "temporary"
      ],
      default: "full-time"
    },
    industry:
    {
      type: String
    },
    experienceLevel:
    {
      type: String,
      enum:
      [
        "entry",
        "mid",
        "senior",
        "lead"
      ],
      default: "entry"
    },
    postedBy:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "JobPost",
  jobPostSchema
);