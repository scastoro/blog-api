const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

// Display all posts
router.get('/posts', postController.all_posts);

// Add new post
router.post('/posts', postController.add_post);

// Get specific post
router.get('/posts/:postId', postController.get_post);

// Toggle publish state
router.get('/posts/:postId/publish', postController.publish_post);

// Update post
router.put('/posts/:postId', postController.update_post);

// Delete post
router.delete('/posts/:postId', postController.delete_post);

// Get all comments on post
router.get('/posts/:postId/comments', commentController.get_all_comments);

// Get one comment
router.get('/posts/:postId/comments/:commentId', commentController.get_comment);

// Add comment
router.post('/posts/:postId/comments', commentController.add_comment);

// Edit comment
router.put('/posts/:postId/comments/:commentId', commentController.edit_comment);

// Delete comment
router.delete('/posts/:postId/comments/:commentId', commentController.delete_comment);

module.exports = router;
