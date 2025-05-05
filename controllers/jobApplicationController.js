const JobApplication = require("../models/JobApplication");
const JobPost = require("../models/JobPost");


exports.createApplication = async (req, res) => {
  try {
    const { jobPost, resume } = req.body;

    const existing = await JobApplication.findOne({
      user: req.user._id,
      jobPost
    });

    if (existing) {
      return res.status(400).json({ error: "You already applied to this job" });
    }

    const application = new JobApplication({
      user: req.user._id,
      jobPost,
      resume
    });

    await application.save();
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ error: "Failed to apply", details: err.message });
  }
};


exports.getUserApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.user._id })
      .populate("jobPost", "title company")
      .populate("resume", "title fileUrl");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications", details: err.message });
  }
};


exports.getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate("jobPost", "title company")
      .populate("resume", "title fileUrl");

    if (!application || application.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve application", details: err.message });
  }
};


exports.updateApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application || application.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Application not found" });
    }

    const { status, notes } = req.body;

    if (status) application.status = status;
    if (notes) application.notes = notes;

    await application.save();
    res.json({ message: "Application updated", application });
  } catch (err) {
    res.status(500).json({ error: "Failed to update application", details: err.message });
  }
};


exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application || application.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Application not found" });
    }

    await application.deleteOne();

    res.json({ message: "Application withdrawn" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete application", details: err.message });
  }
};

exports.getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.params.companyId.trim();


    const jobPosts = await JobPost.find({ company: companyId });
    const jobPostIds = jobPosts.map(post => post._id);

    const applications = await JobApplication.find({
      jobPost: { $in: jobPostIds }
    })
    .populate('user', 'username email')
    .populate('jobPost', 'title company')
    .populate('resume', 'title fileUrl')
    .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
