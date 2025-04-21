// Import database configuration and API key model
const db = require("../config/database");
const { getUserByApiKey } = require("../models/apiKeyModel");

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  // Extract API key from request headers
  const apiKey = req.headers["x-api-key"];

  // If no API key is provided, return a 403 error
  if (!apiKey) {
    return res
      .status(403)
      .json({ error: "API key required in 'x-api-key' header" });
  }

  // Look up the user associated with the API key
  getUserByApiKey(apiKey, (err, row) => {
    if (err) {
      // Log database error and return a 500 error
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: "Database lookup failed" });
    }

    // If no user is found for the API key, return a 401 error
    if (!row) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Update the last used date of the API key in the database
    const lastUsedDate = new Date().toISOString();
    db.run(
      "UPDATE api_keys SET last_used_date = ? WHERE api_key = ?",
      [lastUsedDate, apiKey],
      (err) => {
        if (err) {
          // Log error if updating the API key fails and return a 500 error
          console.error("Failed to update API key usage:", err.message);
          return res.status(500).json({ error: "Error updating API key" });
        }

        // Attach user data to the request object for further processing
        req.user = { id: row.user_id, role: row.role };
        console.log(`API Key Validated: User ${req.user.id}`);

        // Proceed to the next middleware or route handler
        next();
      }
    );
  });
};

module.exports = { validateApiKey };
