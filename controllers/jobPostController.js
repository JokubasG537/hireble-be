const JobPost = require("../models/JobPost");


exports.createJobPost = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    const jobPost = await JobPost.create({
      title,
      company,
      location,
      description,
      postedBy: req.user._id
    });

    res.status(201).json(jobPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating job post", error });
  }
};


exports.getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find().populate("postedBy", "username email");
    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job posts", error });
  }
};


exports.getJobPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findById(id).populate("postedBy", "username email");

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
    jobPost.description = description || jobPost.description;

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
