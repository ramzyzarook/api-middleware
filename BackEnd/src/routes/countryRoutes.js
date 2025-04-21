const express = require("express");
const { getCountryInfo } = require("../controllers/countryController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { validateApiKey } = require("../middleware/apiKeyMiddleware");
const { logApiUsage } = require("../utils/logger");

const router = express.Router();

router.get("/:name", authMiddleware, validateApiKey, async (req, res) => {
    try {
        await logApiUsage(req.user.id, req.originalUrl);

        await getCountryInfo(req, res);
    } catch (error) {
        console.error("Error during country fetch:", error.message);
        res.status(500).json({ error: "Failed to fetch country data or log usage" });
    }
});

module.exports = router;