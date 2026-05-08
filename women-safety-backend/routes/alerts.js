 const express = require("express");
const router = express.Router();

// ✅ SEND ALERT
router.post("/", (req, res) => {
  console.log("🚨 Alert Received:", req.body);

  res.json({
    success: true,
    message: "Alert sent successfully"
  });
});

// ✅ CANCEL ALERT
router.post("/cancel", (req, res) => {
  console.log("❌ Alert Cancelled");

  res.json({
    success: true,
    message: "Alert cancelled successfully"
  });
});

module.exports = router;