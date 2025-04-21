const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./src/config/database"); // see database is initialized
const cookieParser = require("cookie-parser");

dotenv.config(); // Load environment variables from .env
const app = express();

app.use(express.json()); // Parse incoming JSON requests

// Enable CORS with credentials for frontend at localhost:3001
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(cookieParser()); // parser forvJWT authentication

// API route handlers
app.use("/auth", require("./src/routes/authRoutes"));
app.use("/countries", require("./src/routes/countryRoutes"));
app.use("/admin", require("./src/routes/adminRoutes"));


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
