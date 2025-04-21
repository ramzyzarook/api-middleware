const express = require("express");
//Controller Imports:
const {
    getUsers,
    revokeApiKey,
    getUnusedApiKeys,
    getApiKeyOwners
} = require("../controllers/adminController");

//Middleware Imports:
const { authMiddleware } = require("../middleware/authMiddleware");
const   adminMiddleware = require("../middleware/adminMiddleware");
const { logAdminAction } = require("../utils/logger");

const router = express.Router();

const logActionMiddleware = (action) => {
    return async (req, res, next) => {
        const adminId = req.user.id;
        const { userId } = req.params;

        try {
            await logAdminAction(adminId, action, userId);
        } catch (err) {

        }

        next(); 
    };
};

router.get("/users", authMiddleware, adminMiddleware, getUsers);
// Route to view unused API keys 
router.get("/unused-api-keys", authMiddleware, adminMiddleware, getUnusedApiKeys);
// get API key owners of potentially risky keys
router.post("/api-key-owners", authMiddleware, adminMiddleware, getApiKeyOwners);

router.delete("/api-key/:userId",authMiddleware,adminMiddleware,logActionMiddleware("Revoke API Key"),revokeApiKey);

module.exports = router;