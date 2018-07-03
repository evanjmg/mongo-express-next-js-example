const mongoose = require('mongoose')

const Session = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  name: { type: String, required: true },
  token: { type: String, require: true },
});
module.exports = mongoose.model('Session', Session)