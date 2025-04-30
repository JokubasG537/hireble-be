const express = require("express");
const router = express.Router();
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
router.post("/logout", logoutUser);

router.get("/", getUsers);
router.get("/current", getCurrentUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
