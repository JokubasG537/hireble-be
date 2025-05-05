const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const { upload } = require("../utils/cloudinary");
const authMiddleware = require("../middleware/auth");
const { isResumeOwner } = require("../middleware/ownershipCheck");


router.post("/", upload.single("file"), authMiddleware, resumeController.uploadResume);
router.get("/", authMiddleware, resumeController.getUserResumes);


router.get("/:id", authMiddleware, isResumeOwner, resumeController.getResumeById);
router.put("/:id", authMiddleware, isResumeOwner, resumeController.updateResume);
router.delete("/:id", authMiddleware, isResumeOwner, resumeController.deleteResume);


module.exports = router;