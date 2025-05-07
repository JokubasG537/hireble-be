const express = require("express");
const router = express.Router();
const jobAppController = require("../controllers/jobApplicationController");
const authMiddleware = require("../middleware/auth");




router.post("/", authMiddleware, jobAppController.createApplication);
router.get("/", authMiddleware, jobAppController.getUserApplications);
router.get("/:id", authMiddleware, jobAppController.getApplicationById);
router.put("/:id", authMiddleware, jobAppController.updateApplication);
router.delete("/:id", authMiddleware, jobAppController.deleteApplication);
router.get("/company/:companyId", authMiddleware, jobAppController.getCompanyApplications);
router.put(
  "/company/:companyId/:applicationId",
  authMiddleware,
  jobAppController.updateApplicationAsRecruiter
);


module.exports = router;
