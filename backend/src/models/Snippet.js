const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  code: { type: String, required: true },
  language: { type: String, default: "javascript" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Snippet", snippetSchema);
