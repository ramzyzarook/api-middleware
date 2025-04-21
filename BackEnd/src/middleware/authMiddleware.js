// Import jwt for token verification and dotenv for environment variables
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies?.token;

  // If no token is provided, return a 401 Unauthorized error
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // Verify the JWT token using the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Log verification error and return a 401 Invalid/Expired token error
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach decoded user data to the request object for further processing
    req.user = decoded;
    console.log(`JWT Validated: User ${req.user.id}`);

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = { authMiddleware };
