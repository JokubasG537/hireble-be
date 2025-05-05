const Resume = require("../models/Resume");
const { cloudinary } = require("../utils/cloudinary");
const User = require("../models/userModel");

exports.uploadResume = async (req, res) => {
  try {
    const resume = new Resume({
      user: req.user._id,
      title: req.body.title || req.file.originalname,
      fileUrl: req.file.path,
      publicId: req.file.filename,
    });

    await resume.save();
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { resumes: resume._id } }
    );

    res.status(201).json({ message: "Resume uploaded", resume });
  } catch (err) {
    console.error("Upload error:", err);
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
    const resume = req.resumeData; 
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
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { resumes: req.params.id } }
    );

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Resume deletion failed",
      details: err.message,
    });
  }
};

exports.updateResumeFile = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this resume" });
    }

    await cloudinary.uploader.destroy(resume.publicId);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resumes",
      public_id: resume.publicId,
      overwrite: true,
      invalidate: true,
    });

    resume.fileUrl = result.secure_url;
    await resume.save();

    res.status(200).json({ message: "Resume file updated", resume });
  } catch (err) {
    res.status(500).json({ error: "File update failed", details: err.message });
  }
};
