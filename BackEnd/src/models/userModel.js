const db = require("../config/database");

// Create a new user with hashed password and role
const createUser = (username, hashedPassword, role, callback) => {
  const createdAt = new Date().toISOString(); // Timestamp for creation
  const lastLoggedDate = createdAt; // Set initial login time same as creation

  db.run(
    `INSERT INTO users (username, password, role, created_date, last_logged_date) VALUES (?, ?, ?, ?, ?)`,
    [username, hashedPassword, role, createdAt, lastLoggedDate],
    function (err) {
      // Return error or newly created user ID
      callback(err, this ? this.lastID : null);
    }
  );
};

// Update the last_logged_date for a user after successful login
const updateLastLoggedDate = (userId) => {
  const lastLoggedDate = new Date().toISOString();
  db.run(`UPDATE users SET last_logged_date = ? WHERE id = ?`, [
    lastLoggedDate,
    userId,
  ]);
};

// Find a user by username (used for login and checks)
const findUserByUsername = (username, callback) => {
  db.get("SELECT * FROM users WHERE username = ?", [username], callback);
};

module.exports = {
  createUser,
  updateLastLoggedDate,
  findUserByUsername,
};
