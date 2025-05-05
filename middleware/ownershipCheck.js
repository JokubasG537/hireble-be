const Resume = require("../models/Resume");

const isResumeOwner = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);


    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }


    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You don't own this resume" });
    }


    req.resumeData = resume;

    next();
  } catch (err) {
    res.status(500).json({ error: "Ownership verification failed", details: err.message });
  }
};

module.exports = { isResumeOwner };
