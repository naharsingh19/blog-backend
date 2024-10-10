const mongoose = require('mongoose');

const StoryAuditSchema = new mongoose.Schema({
  storyId: String,
  action: String,
  timestamp: Date,
  details: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('StoryAudit', StoryAuditSchema);
