const express = require("express");
const router = express.Router();
const Snippet = require("../models/Snippet");
const authMiddleware = require("../middleware/authMiddleware");

// Create snippet (protected)
router.post("/", authMiddleware, async (req, res) => {
  const { title, code, language } = req.body;

  if (!req.user) return res.status(401).json({ msg: "User not found" });

  try {
    const snippet = new Snippet({
      title,
      code,
      language,
      user: req.user.id, // must exist
    });
    await snippet.save();
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all snippets
router.get("/", async (req, res) => {
  try {
    const snippets = await Snippet.find().populate("user", "name email");
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
