const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  // Placeholder — wire to MongoDB / email in a later step
  console.log("[Contact]", { name, email, message });
  res.json({ success: true, message: "Thanks! We'll be in touch soon." });
});

module.exports = router;
