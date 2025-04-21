const express = require("express");
const { register, login, generateApiKey, getApiKeys, deleteApiKey, refreshToken } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
// const { validateApiKey } = require("../middleware/apiKeyMiddleware");


const router = express.Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);

// API Key Routes
router.post("/generate-api-key", authMiddleware, generateApiKey);
router.get("/get-api-keys", authMiddleware, getApiKeys);
router.delete("/delete-api-key/:apiKey", authMiddleware, deleteApiKey);
router.post("/refresh-token", refreshToken);


module.exports = router;
