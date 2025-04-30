const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const savedJobController = require("../controllers/savedJobController");

router.post("/", authMiddleware, savedJobController.saveJob);
router.get("/", authMiddleware, savedJobController.getSavedJobs);
router.put("/:id", authMiddleware, savedJobController.updateSavedJob);
router.delete("/:id", authMiddleware, savedJobController.deleteSavedJob);

module.exports = router;
