const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

// Routes for company CRUD operations
router.post("/", companyController.createCompany); // Create a new company
router.get("/", companyController.getAllCompanies); // Get all companies
router.get("/:id", companyController.getCompanyById); // Get company by ID
router.put("/:id", companyController.updateCompany); // Update company by ID
router.delete("/:id", companyController.deleteCompany); // Delete company by ID

module.exports = router;
