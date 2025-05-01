const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

router.post("/", companyController.createCompany);
router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);



module.exports = router;
