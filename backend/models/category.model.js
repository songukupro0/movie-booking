const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  icon: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Category', categorySchema);