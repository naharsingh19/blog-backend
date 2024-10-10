const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cleanupExpiredStories = require('./utils/cleanupStories');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
})
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blogs');
const storiesRouter = require("./routes/stories");

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use("/api/stories", storiesRouter);
// Serve uploaded files
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

// Run cleanup every hour
setInterval(cleanupExpiredStories, 60 * 60 * 1000);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));