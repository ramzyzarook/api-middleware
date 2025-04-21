
const {
  getAllUsersWithKeyCount, // Fetch all users and  API key count
  deleteApiKeyAndUsageByUserId, // Delete API data for a user
  getUnusedApiKeys, // Retrieve api data
  getApiKeyOwners, 
} = require("../models/apiKeyModel");

// Controller to fetch all users and their API key counts
const getUsers = (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  // Fetch all users and the number of API keys associated with each user
  getAllUsersWithKeyCount((err, rows) => {

    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // Send the list of users and their API key counts as the response
    res.json(rows);
  });
};

// Controller to revoke an API key for a specific user
const revokeApiKey = (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  // Extract userId from the request parameters
  const { userId } = req.params;

  // Call model to delete the API key and its usage data for the given userId
  deleteApiKeyAndUsageByUserId(userId, (err) => {

    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to revoke API key or usage" });
    }

    res.json({ message: "API key revoked and usage history deleted" });
  });
};

// Controller to fetch API keys that have not been used in the last 2 days
const fetchUnusedApiKeys = (req, res) => {
  // Calculate the date for two days ago
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // Format the date to match the database format (e.g., "YYYY-MM-DD HH:mm:ss")
  const formattedDate = twoDaysAgo.toISOString().slice(0, 19).replace("T", " ");

  // Fetch unused API keys based on the formatted date
  getUnusedApiKeys(formattedDate, (err, rows) => {
    // Handle any errors that occur when querying the database
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // Send the list of unused API keys back as the response
    res.json(rows);
  });
};

// Controller to fetch owners of the provided API keys
const fetchApiKeyOwners = (req, res) => {

  const { apiKeys } = req.body;

  // Check if no API keys were provided, and respond with a bad request error
  if (!apiKeys || apiKeys.length === 0) {
    return res.status(400).json({ error: "No API keys provided" });
  }

  // Fetch the owners of the provided API keys from the model
  getApiKeyOwners(apiKeys, (err, rows) => {
    // Handle any errors that occur during the database query
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // Send the list of API key owners back as the response
    res.json(rows);
  });
};

// Export the controller functions for use in the routes
module.exports = {
  getUsers, 
  revokeApiKey, 
  getUnusedApiKeys: fetchUnusedApiKeys, 
  getApiKeyOwners: fetchApiKeyOwners, 
};
