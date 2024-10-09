const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createBlog, updateBlog, deleteBlog, getBlogs, getBlog } = require('../controllers/blogController');
const auth = require('../middlewares/auth');

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

// Define routes
router.post('/', auth, upload.single('image'), createBlog);
router.put('/:id', auth, upload.single('image'), updateBlog);
router.delete('/:id', auth, deleteBlog);
router.get('/', getBlogs);
router.get('/:id', getBlog);

module.exports = router;
