const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const companyJoinRequestController = require("../controllers/companyJoinRequestController");

const { approveRequest, rejectRequest, createRequest } = require("../controllers/companyJoinRequestController");

router.post(
  "/",
  authMiddleware,
  authorizeRole("recruiter"),
  companyJoinRequestController.createRequest
);

router.patch(
  "/:requestId/approve",
  authMiddleware,
  authorizeRole("recruiter"),
  companyJoinRequestController.approveRequest
);

router.patch(
  "/:requestId/reject",
  authMiddleware,
  authorizeRole("recruiter"),
  companyJoinRequestController.rejectRequest
);

module.exports = router;
