const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);

router.get("/current",authMiddleware, getCurrentUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/logout",authMiddleware, logoutUser);

module.exports = router;
