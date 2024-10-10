const Story = require('../models/Story');
const StoryAudit = require('../models/StoryAudit');

// Create a new story
exports.createStory = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required for creating a story' });
    }

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'User information is missing' });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const newStory = new Story({
      user: req.user._id,
      username: req.user.username,
      imageUrl,
      caption,
      expiresAt
    });

    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    console.error('Error creating story:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ message: 'Error creating story', details: error.message });
  }
};

// Get all stories
exports.getAllStories = async (req, res) => {
  try {
    const currentTime = new Date();
    
    const stories = await Story.find({ expiresAt: { $gt: currentTime } })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")
      .limit(100);

    console.log('Stories:', stories.map(s => ({ 
      id: s._id, 
      username: s.username, 
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      timeUntilExpiry: (s.expiresAt - currentTime) / 1000 / 60 + ' minutes'
    })));
    
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching all stories:", error);
    res.status(500).json({ message: "Error fetching stories", details: error.message });
  }
};

// Get stories for a specific user
exports.getUserStories = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentTime = new Date();
    console.log(`Fetching stories for user ${userId}. Current time:`, currentTime);
    
    const stories = await Story.find({ 
      user: userId,
      expiresAt: { $gt: currentTime } 
    })
      .sort({ createdAt: -1 })
      .limit(100);

    console.log(`Found ${stories.length} non-expired stories for user ${userId}`);
    console.log('User stories:', stories.map(s => ({ id: s._id, username: s.username, expiresAt: s.expiresAt })));
    
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching user stories:", error);
    res.status(500).json({ message: "Error fetching user stories", details: error.message });
  }
};

// Get story audit log
exports.getStoryAuditLog = async (req, res) => {
  try {
    const auditLog = await StoryAudit.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json(auditLog);
  } catch (error) {
    console.error("Error fetching story audit log:", error);
    res.status(500).json({ message: "Error fetching story audit log", details: error.message });
  }
};

// Check expired stories
exports.checkExpiredStories = async (req, res) => {
  try {
    const currentTime = new Date();
    const expiredStories = await Story.find({ expiresAt: { $lte: currentTime } });
    
    console.log(`Found ${expiredStories.length} expired stories`);
    console.log('Expired stories:', expiredStories.map(s => ({
      id: s._id,
      username: s.username,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      timeOverdue: (currentTime - s.expiresAt) / 1000 / 60 + ' minutes'
    })));

    res.status(200).json({ message: `Found ${expiredStories.length} expired stories`, expiredStories });
  } catch (error) {
    console.error("Error checking expired stories:", error);
    res.status(500).json({ message: "Error checking expired stories", details: error.message });
  }
};
