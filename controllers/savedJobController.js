const SavedJob = require("../models/SavedJob");
const JobPost = require("../models/JobPost");


exports.saveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobPostId, note } = req.body;


    const existing = await SavedJob.findOne({ user: userId, jobPost: jobPostId });
    if (existing) {
      return res.status(400).json({ message: "Job already saved." });
    }


    const jobExists = await JobPost.findById(jobPostId);
    if (!jobExists) {
      return res.status(404).json({ message: "Job not found." });
    }

    const savedJob = await SavedJob.create({
      user: userId,
      jobPost: jobPostId,
      note
    });

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: "Error saving job", error });
  }
};


exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedJobs = await SavedJob.find({ user: userId }).populate("jobPost");

    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved jobs", error });
  }
};


exports.updateSavedJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { note } = req.body;

    const updated = await SavedJob.findOneAndUpdate(
      { _id: id, user: userId },
      { note },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Saved job not found or not yours" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating saved job", error });
  }
};


exports.deleteSavedJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await SavedJob.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({ message: "Saved job not found or not yours" });
    }

    res.status(200).json({ message: "Saved job deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting saved job", error });
  }
};
