const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Display all posts
router.get('/posts', postController.all_posts);

// Add new post
router.post('/posts', postController.add_post);

// Get specific post
router.get('/posts/:postId', postController.get_post);

// Toggle publish state
router.get('/posts/:postId/publish', postController.publish_post);

// Update post
router.post('/posts/:postId/update', postController.update_post);

// Delete post
router.delete('/posts/:postId', postController.delete_post);

module.exports = router;
