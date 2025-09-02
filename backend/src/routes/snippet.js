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

// Delete snippet (protected + role-based)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) return res.status(404).json({ msg: "Snippet not found" });

    // Only allow admin or the snippet owner to delete
    if (req.user.role !== "admin" && snippet.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    await snippet.remove();
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Update snippet (protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Only the owner can update
    if (snippet.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSnippet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
