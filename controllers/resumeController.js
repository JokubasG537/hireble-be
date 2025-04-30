const Resume = require("../models/Resume");
const { cloudinary } = require("../utils/cloudinary");

exports.uploadResume = async (req, res) => {
  try {
    const resume = new Resume({
      user: req.user._id,
      title: req.body.title || req.file.originalname,
      fileUrl: req.file.path,
      publicId: req.file.filename
    });

    await resume.save();

    res.status(201).json({ message: "Resume uploaded", resume });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve resumes", details: err.message });
  }
};


exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve resume", details: err.message });
  }
};


exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (req.body.title) resume.title = req.body.title;
    await resume.save();

    res.status(200).json({ message: "Resume updated", resume });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};


exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    await cloudinary.uploader.destroy(resume.publicId);

    await resume.deleteOne();

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Resume deletion failed",
      details: err.message
    });
  }
};
