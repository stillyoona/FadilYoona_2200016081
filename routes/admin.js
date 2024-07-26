const express = require("express"); // Import the express library to create the router
const router = express.Router(); // Create an instance of an Express Router
const { authenticateToken, authorizeRole } = require("../middleware/auth"); // Import middleware functions for authentication and role authorization
const User = require("../models/User.model"); // Import the User model
const Attendance = require("../models/Attendance.model"); // Import the Attendance model

// Get all employees endpoint
router.get(
  "/employees",
  authenticateToken, // Middleware to authenticate the JWT token
  authorizeRole("admin"), // Middleware to authorize the role of "admin"
  async (req, res) => {
    try {
      // Find all users with the role of "karyawan" (employee)
      const employees = await User.findAll({ where: { role: "karyawan" } });
      // Respond with a 200 OK status and the list of employees
      res.status(200).json({ employees });
    } catch (error) {
      // Respond with a 500 Internal Server Error status and error message if there's an issue
      res.status(500).json({ error: error.message });
    }
  }
);

// Recap attendance endpoint
router.get(
  "/attendance",
  authenticateToken, // Middleware to authenticate the JWT token
  authorizeRole("admin"), // Middleware to authorize the role of "admin"
  async (req, res) => {
    try {
      // Find all attendance records and include related user data
      const attendance = await Attendance.findAll({
        include: [
          {
            model: User,
            as: "user", // Include the User model with the alias "user"
            attributes: { exclude: ["password"] }, // Exclude the password field from the User model
          },
        ],
      });
      // Respond with a 200 OK status and the list of attendance records
      res.status(200).json({ attendance });
    } catch (error) {
      // Respond with a 500 Internal Server Error status and error message if there's an issue
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router; // Export the router for use in other parts of the application
