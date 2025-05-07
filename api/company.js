const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

router.post("/", authMiddleware,  companyController.createCompany);
router.get("/",  companyController.getAllCompanies);
router.get("/:id",  companyController.getCompanyById);
router.put("/:id", authMiddleware, authorizeRole("recruiter", "admin"), companyController.updateCompany);
router.delete("/:id", authMiddleware, authorizeRole("recruiter", "admin"), companyController.deleteCompany);
router.get("/current/company", authMiddleware, authorizeRole("recruiter", "admin"), companyController.getCurrentCompany);



module.exports = router;
