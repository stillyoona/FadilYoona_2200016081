const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const Attendance = require("../models/Attendance.model");
const User = require("../models/User.model");

// Check-in
router.post("/checkin", authenticateToken, async (req, res) => {
  const { id } = req.user;

  try {
    const attendance = await Attendance.create({
      userId: id,
      checkIn: new Date(),
    });
    res.status(201).json({ message: "Check-in recorded", attendance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check-out
router.post("/checkout", authenticateToken, async (req, res) => {
  const { id } = req.user;

  try {
    const attendance = await Attendance.findOne({
      where: { userId: id, checkOut: null },
    });
    if (!attendance)
      return res
        .status(404)
        .json({ message: "No active attendance record found" });

    attendance.checkOut = new Date();
    await attendance.save();
    res.status(200).json({ message: "Check-out recorded", attendance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View attendance history
router.get("/history", authenticateToken, async (req, res) => {
  const { id } = req.user;

  try {
    const history = await Attendance.findAll({
      where: { userId: id },
      include: [{ model: User, as: "user" }],
    });
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
