const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const Company = require("../models/Company");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
  assignCompanyToRecruiter
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/current", authMiddleware, getCurrentUser);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/logout", authMiddleware, logoutUser);
router.patch("/company", authMiddleware, authorizeRole("recruiter"), assignCompanyToRecruiter);


module.exports = router;
