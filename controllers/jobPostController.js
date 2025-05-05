const JobPost = require("../models/JobPost");
const sanitizeHtml = require("sanitize-html");

exports.createJobPost = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ["p", "h1", "h2", "h3", "ul", "ol", "li", "strong", "em", "a"],
      allowedAttributes: {
        a: ["href"],
      },
    });

    const jobPost = new JobPost({
      title,
      company,
      location,
      description: sanitizedDescription,
      postedBy: req.user._id,
    });

    await jobPost.save();

    res.status(201).json(jobPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating job post", error });
  }
};


const sortOptionsMap = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  title_asc: { title: 1 },
  title_desc: { title: -1 }
};

exports.getAllJobPosts = async (req, res) => {
  try {
    const {
      location,
      employmentType,
      industry,
      experienceLevel,
      keyword,
      page = 1,
      limit = 10,
      sort = "newest"
    } = req.query;

    const filter = {};

    if (location) filter.location = location;
    if (employmentType) filter.employmentType = employmentType;
    if (industry) filter.industry = industry;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOption = sortOptionsMap[sort] || sortOptionsMap["newest"];

    const [jobPosts, total] = await Promise.all([
      JobPost.find(filter)
        .populate("postedBy", "username email")
        .populate("company", "name")
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      JobPost.countDocuments(filter)
    ]);

    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      jobPosts
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching job posts", error });
  }
};



exports.getJobPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const jobPost = await JobPost.findById(id)
      .populate("postedBy", "username email")
      .populate("company", "name");

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found." });
    }

    res.status(200).json(jobPost);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job post", error });
  }
};


exports.updateJobPost = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findById(id);

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found." });
    }

    const isOwner = jobPost.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this post." });
    }

    const { title, company, location, description } = req.body;

    jobPost.title = title || jobPost.title;
    jobPost.company = company || jobPost.company;
    jobPost.location = location || jobPost.location;

    if (description) {
      jobPost.description = sanitizeHtml(description, {
        allowedTags: ["p", "h1", "h2", "h3", "ul", "ol", "li", "strong", "em", "a"],
        allowedAttributes: {
          a: ["href"],
        },
      });
    }

    const updatedPost = await jobPost.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating job post", error });
  }
};



exports.deleteJobPost = async (req, res) => {
  try {
    const { id } = req.params;

    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found." });
    }

    const isOwner = jobPost.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }

    await jobPost.deleteOne();
    res.status(200).json({ message: "Job post deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job post", error });
  }
};
