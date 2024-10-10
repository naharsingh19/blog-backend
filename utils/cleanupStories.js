const Story = require('../models/Story');

const cleanupExpiredStories = async () => {
  try {
    const currentTime = new Date();
    const result = await Story.deleteMany({ expiresAt: { $lte: currentTime } });
    console.log(`Cleaned up ${result.deletedCount} expired stories`);
  } catch (error) {
    console.error('Error cleaning up expired stories:', error);
  }
};

module.exports = cleanupExpiredStories;
