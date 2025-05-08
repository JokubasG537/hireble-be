const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const mongoose = require("mongoose");


const registerUser = async (req, res) => {
  const { username, email, password, role  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    });


    await newUser.save();

    if (newUser.role === "recruiter") {
      return res.status(201).json({
        message: "Recruiter registered. Please create or select a company.",
        user: { id: newUser._id, username: newUser.username, email: newUser.email },
        token: jwt.sign(
          { id: newUser._id, username: newUser.username },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        ),
        nextStep: "company"
      });
    }


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
    const user = await User.findOne({ email }).select("+password");
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
    if (req.query.ids) {
      const userIds = req.query.ids.split(',');
      const users = await User.find({
        _id: { $in: userIds }
      }).select('-password');

      return res.status(200).json(users);
    }

    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};


const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const user = await User.findById(id)
      .select("-password")
      .populate('company');

    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user." });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate('company');

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
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


const assignCompanyToRecruiter = async (req, res) => {
  const { companyId } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can be assigned a company" });
    }


    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    user.company = companyId;
    await user.save();

    company.recruiters.push(user._id);
    await company.save();

    res.status(200).json({
      message: "Company assigned to recruiter",
      user: {
        id: user._id,
        username: user.username,
        company: user.company
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign company", error: err.message });
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
  // addToFavorites,
  // removeFromFavorites,
  assignCompanyToRecruiter
};
