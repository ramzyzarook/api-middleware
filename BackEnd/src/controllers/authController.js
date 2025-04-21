// Import necessary modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// Import functions from models
const {
  createUser,
  updateLastLoggedDate,
  findUserByUsername,
} = require("../models/userModel");
const {
  createApiKey,
  getApiKeysByUser,
  deleteApiKey,
} = require("../models/apiKeyModel");

// User registration handler
const register = (req, res) => {
  const { username, password, role, adminSecret } = req.body;

  // Default role is 'user', change to 'admin' if valid admin secret is provided
  let userRole = "user";

  if (role === "admin") {
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ error: "Invalid admin secret key" });
    }
    userRole = "admin";
  }

  // Hash the password before saving to the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    // Create the user in the database
    createUser(username, hash, userRole, (err) => {
      if (err) {
        console.error("User creation failed:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("User registered successfully");
      res
        .status(201)
        .json({ message: `User registered successfully as ${userRole}` });
    });
  });
};

// User login handler
const login = (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  findUserByUsername(username, (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });

    // Compare the provided password with the stored hash
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err)
        return res.status(500).json({ error: "Error verifying password" });
      if (!isMatch)
        return res.status(401).json({ error: "Invalid username or password" });

      // Create JWT token and send it in the response
      const token = jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Update last login date
      updateLastLoggedDate(user.id);
      console.log("User logged in successfully");

      // Set the token as a cookie
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 60 * 60 * 1000,
        })
        .json({ token, username: user.username, role: user.role });
    });
  });
};

// API key generation handler
const generateApiKey = (req, res) => {
  const userId = req.user.id;
  const apiKey = crypto.randomBytes(16).toString("hex");
  const createdDate = new Date().toISOString();
  const lastUsedDate = null;

  // Create the API key in the database
  createApiKey(userId, apiKey, createdDate, lastUsedDate, (err) => {
    if (err) return res.status(500).json({ error: "Error generating API key" });
    res.json({ apiKey, createdDate });
  });
};

// Get all API keys for the logged-in user
const getApiKeys = (req, res) => {
  const userId = req.user.id;
  getApiKeysByUser(userId, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ apiKeys: rows });
  });
};

// Remove an API key for the logged-in user
const removeApiKey = (req, res) => {
  const { apiKey } = req.params;
  const userId = req.user?.id;

  if (!apiKey)
    return res
      .status(400)
      .json({ error: "API key is required in the request URL" });
  if (!userId) return res.status(403).json({ error: "Unauthorized access" });

  // Delete the API key from the database
  deleteApiKey(userId, apiKey, (err) => {
    if (err) {
      console.error("Error deleting API key:", err);
      return res.status(500).json({ error: "Failed to delete API key" });
    }

    res.json({ message: "API key successfully deleted" });
  });
};

// Refresh the JWT token
const refreshToken = (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  // Verify the token and issue a new one
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    // Create a new token with updated expiration
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the new token in the response
    res
      .cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000,
      })
      .json({ message: "Token refreshed" });
  });
};

module.exports = {
  register,
  login,
  generateApiKey,
  getApiKeys,
  deleteApiKey: removeApiKey,
  refreshToken,
};
