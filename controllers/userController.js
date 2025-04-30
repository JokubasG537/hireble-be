const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "User registered successfully.",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful.",
      user: { id: user._id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};


const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully. Please clear your token from localStorage." });
};


const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};


const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

const getCurrentUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch current user." });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) return res.status(409).json({ message: "Email already in use." });
    }

    if (username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: id } });
      if (usernameExists) return res.status(409).json({ message: "Username already taken." });
    }

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found." });

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'MongoServererror' && error.code === 11000) {
      return res.status(409).json({ message: "Duplicate key error. Email or username already exists." });
    }
    res.status(500).json({ message: "Failed to update user." });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User deleted successfully.",
      deletedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};
//favs
const addToFavorites = async (req, res) => {
  const userId = req.params.userId;
  const { carId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.favorites.includes(carId)) {
      return res.status(400).json({ message: "Car is already in favorites." });
    }

    user.favorites.push(carId);
    await user.save();

    res.status(200).json({

      favorites: user.favorites
    });
  } catch (error) {
    console.error(error);

  }
};

const removeFromFavorites = async (req, res) => {
  const userId = req.params.userId;
  const carId = req.params.carId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Nerasta" });

    user.favorites = user.favorites.filter(id => id.toString() !== carId);
    await user.save();

    res.status(200).json({

      favorites: user.favorites
    });
  } catch (error) {
    console.error(error);

  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
  addToFavorites,
  removeFromFavorites
};
