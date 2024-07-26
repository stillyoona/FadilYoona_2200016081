const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library for handling JWT tokens
require("dotenv").config(); // Load environment variables from a .env file into process.env

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Extract the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // Split the header to get the token (typically in the format "Bearer token")
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, respond with 401 Unauthorized
  if (!token) return res.status(401).json({ message: "Access token required" });

  // Verify the token using the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If there's an error verifying the token, respond with 403 Forbidden
    if (err) return res.status(403).json({ message: "Invalid token" });

    // If verification is successful, attach the user information to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

// Middleware to authorize user based on role
const authorizeRole = (role) => {
  // Return a middleware function
  return (req, res, next) => {
    // Check if the user's role matches the required role
    if (req.user.role !== role)
      // If roles do not match, respond with 403 Forbidden
      return res.status(403).json({ message: "Forbidden" });
    next(); // Proceed to the next middleware or route handler if authorized
  };
};

module.exports = { authenticateToken, authorizeRole }; // Export the middleware functions for use in other parts of the application
