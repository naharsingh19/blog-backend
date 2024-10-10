const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth'); // Correct path
const storyController = require('../controllers/storyController');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a new story
router.post('/', auth, upload.single('image'), storyController.createStory);

// Get all stories
router.get('/', auth, storyController.getAllStories);

// Get stories for a specific user
router.get('/user/:userId', auth, storyController.getUserStories);

// Get story audit log
router.get('/audit-log', auth, storyController.getStoryAuditLog);

// Check expired stories
router.get('/check-expired', auth, storyController.checkExpiredStories);

module.exports = router;
