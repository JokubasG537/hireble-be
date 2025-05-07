const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const companyJoinRequestController = require("../controllers/companyJoinRequestController");

const { approveRequest, rejectRequest, createRequest, getRequestsByCompany } = require("../controllers/companyJoinRequestController");

router.post(
  "/",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  companyJoinRequestController.createRequest
);

router.patch(
  "/:requestId/approve",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  companyJoinRequestController.approveRequest
);

router.patch(
  "/:requestId/reject",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  companyJoinRequestController.rejectRequest
);

router.get(
  '/company/:companyId',
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  companyJoinRequestController.getRequestsByCompany
);

module.exports = router;
