const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: Object,  // Assuming you're using Editor.js which returns an object
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  image: { type: String }, // URL to the image
  video: { type: String }, // URL to the video
  image: String,
  video: String,
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
