const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true
    },
    logoUrl: {
      type: String,
    },
    jobPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],
    recruiters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
