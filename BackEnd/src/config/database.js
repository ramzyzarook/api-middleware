// Import sqlite3 for database interaction
const sqlite3 = require("sqlite3").verbose();

// Initialize SQLite database connection
const db = new sqlite3.Database(
  "./my_database.sqlite", // Database file location
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, // Open with read-write and create if it doesn't exist
  (err) => {
    if (err) {
      // Log error if database connection fails
      console.error("Database connection failed:", err.message);
    } else {
      // Log successful connection
      console.log("Database Connected to SQLite database");

      // Ensure tables are created
      db.serialize(() => {
        db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT DEFAULT 'user',
                    created_date TEXT DEFAULT (datetime('now')),
                    last_logged_date TEXT
                )
            `);

        db.run(`
                CREATE TABLE IF NOT EXISTS api_keys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    api_key TEXT UNIQUE NOT NULL,
                    created_date TEXT DEFAULT (datetime('now')),
                    last_used_date TEXT,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            `);

        db.run(`
                CREATE TABLE IF NOT EXISTS api_usage (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    endpoint TEXT NOT NULL,
                    accessed_at TEXT DEFAULT (datetime('now')),
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            `);
      });
    }
  }
);

module.exports = db;
