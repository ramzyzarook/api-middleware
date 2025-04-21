// Import the database connection
const db = require("../config/database");

// Get all users with the count of their associated API keys
const getAllUsersWithKeyCount = (callback) => {
  const query = `
        SELECT 
            users.username, 
            users.last_logged_date, 
            COALESCE(COUNT(api_keys.id), 0) AS api_key_count
        FROM users
        LEFT JOIN api_keys ON users.id = api_keys.user_id
        GROUP BY users.id
    `;
  db.all(query, [], callback);
};

// Delete API keys and associated usage records by user ID
const deleteApiKeyAndUsageByUserId = (userId, callback) => {
  // Delete usage records first
  db.run("DELETE FROM api_usage WHERE user_id = ?", [userId], function (err) {
    if (err) return callback(err);

    // Delete the API keys after usage records are removed
    db.run("DELETE FROM api_keys WHERE user_id = ?", [userId], function (err2) {
      callback(err2);
    });
  });
};

// Get unused API keys, i.e., those not used since the specified date
const getUnusedApiKeys = (formattedDate, callback) => {
  const query = `
        SELECT 
            user_id,
            api_key, 
            created_date, 
            COALESCE(last_used_date, 'Never Used') AS last_used_date
        FROM api_keys
        WHERE last_used_date IS NULL OR last_used_date < ?
    `;
  db.all(query, [formattedDate], callback);
};

// Get the owners of specified API keys
const getApiKeyOwners = (apiKeys, callback) => {
  // Dynamically build query placeholders for the given API keys
  const placeholders = apiKeys.map(() => "?").join(", ");
  const query = `
        SELECT 
            users.username, 
            COUNT(api_keys.id) AS risky_api_count,
            COALESCE(COUNT(api_usage.id), 0) AS search_count,
            GROUP_CONCAT(api_keys.api_key) AS risky_api_keys
        FROM users
        JOIN api_keys ON users.id = api_keys.user_id
        LEFT JOIN api_usage ON users.id = api_usage.user_id
        WHERE api_keys.api_key IN (${placeholders})
        GROUP BY users.id
    `;
  db.all(query, apiKeys, callback);
};

// Create a new API key for a user
const createApiKey = (userId, apiKey, createdDate, lastUsedDate, callback) => {
  db.run(
    "INSERT INTO api_keys (user_id, api_key, created_date, last_used_date) VALUES (?, ?, ?, ?)",
    [userId, apiKey, createdDate, lastUsedDate],
    callback
  );
};

// Get all API keys for a specific user
const getApiKeysByUser = (userId, callback) => {
  db.all(
    "SELECT api_key, created_date, last_used_date FROM api_keys WHERE user_id = ?",
    [userId],
    callback
  );
};

// Delete a specific API key for a user
const deleteApiKey = (userId, apiKey, callback) => {
  db.run(
    "DELETE FROM api_keys WHERE user_id = ? AND api_key = ?",
    [userId, apiKey],
    callback
  );
};

// Get the user associated with a specific API key
const getUserByApiKey = (apiKey, callback) => {
  const query = `
        SELECT api_keys.user_id, users.role
        FROM api_keys
        JOIN users ON users.id = api_keys.user_id
        WHERE api_key = ?
    `;
  db.get(query, [apiKey], callback);
};

// Export the functions for use in other modules
module.exports = {
  getAllUsersWithKeyCount,
  deleteApiKeyAndUsageByUserId,
  getUnusedApiKeys,
  getApiKeyOwners,
  createApiKey,
  getApiKeysByUser,
  deleteApiKey,
  getUserByApiKey,
};
