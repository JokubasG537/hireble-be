const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const jobPostController = require("../controllers/jobPostController");

router.post(
  "/",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  jobPostController.createJobPost
);

router.get("/", jobPostController.getAllJobPosts);

router.get("/:id", jobPostController.getJobPostById);

router.put(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  jobPostController.updateJobPost
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  jobPostController.deleteJobPost
);

module.exports = router;