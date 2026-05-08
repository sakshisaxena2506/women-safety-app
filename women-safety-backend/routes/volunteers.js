const express = require("express");
const router = express.Router();

// test API
router.get("/", (req, res) => {
  res.json({ message: "Volunteers route working" });
});

module.exports = router;