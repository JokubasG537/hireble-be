const CompanyJoinRequest = require("../models/CompanyJoinRequest");
const Company = require("../models/Company");
const User = require("../models/userModel");

const createRequest = async (req, res) => {
  try {
    const recruiterId = req.user._id; // from auth middleware
    const { companyId } = req.body;

    // Check if a pending request already exists
    const existing = await CompanyJoinRequest.findOne({
      recruiter: recruiterId,
      company: companyId,
      status: "pending"
    });
    if (existing) {
      return res.status(400).json({ message: "You have already requested to join this company." });
    }

    const request = new CompanyJoinRequest({
      recruiter: recruiterId,
      company: companyId
    });
    await request.save();

    res.status(201).json({ message: "Join request submitted.", request });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit join request.", error: error.message });
  }
};
const approveRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await CompanyJoinRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const company = await Company.findById(request.company);
    if (!company) return res.status(404).json({ message: "Company not found" });


    const currentRecruiters = company.recruiters;
    if (!currentRecruiters.includes(req.user._id)) {
      return res.status(403).json({ message: "You must be a recruiter to approve requests" });
    }

    request.status = "approved";
    await request.save();

    company.recruiters.push(request.recruiter);
    await company.save();

    res.status(200).json({
      message: "Request approved and recruiter added to company",
      request
    });
  } catch (error) {
    res.status(500).json({ message: "Error approving request", error: error.message });
  }
};

const rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await CompanyJoinRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.status(200).json({
      message: "Request rejected",
      request
    });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting request", error: error.message });
  }
};

module.exports = {
  approveRequest,
  rejectRequest,
  createRequest
};