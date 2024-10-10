const mongoose = require('mongoose');
const StoryAudit = require('./StoryAudit');

const StorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

StorySchema.pre('remove', async function(next) {
  await StoryAudit.create({
    storyId: this._id,
    action: 'remove',
    timestamp: new Date(),
    details: this.toObject()
  });
  next();
});

StorySchema.pre('deleteMany', async function(next) {
  const docs = await this.model.find(this.getFilter());
  await StoryAudit.insertMany(docs.map(doc => ({
    storyId: doc._id,
    action: 'deleteMany',
    timestamp: new Date(),
    details: doc.toObject()
  })));
  next();
});


module.exports = mongoose.model('Story', StorySchema);
