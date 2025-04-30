const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const { upload } = require("../utils/cloudinary");


router.post("/", upload.single("file"), resumeController.uploadResume);
router.get("/", resumeController.getUserResumes);
router.get("/:id", resumeController.getResumeById);
router.put("/:id", resumeController.updateResume);
router.delete("/:id", resumeController.deleteResume);


module.exports = router;