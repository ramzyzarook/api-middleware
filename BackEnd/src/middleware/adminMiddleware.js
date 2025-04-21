// Middleware to check if the user is an admin
module.exports = (req, res, next) => {
  // Check if the user is authenticated and has the 'admin' role
  if (!req.user || req.user.role !== "admin") {
    // Log unauthorized access attempt with user ID (if available)
    console.warn(
      `Unauthorized access attempt by User ID: ${req.user?.id || "Unknown"}`
    );

    // Respond with a 403 Forbidden error if user is not an admin
    return res.status(403).json({ error: "Access denied: Admins only" });
  }

  // Proceed to the next middleware or route handler if the user is an admin
  next();
};
