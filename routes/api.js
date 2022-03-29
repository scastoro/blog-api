const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

router.get('/posts', async function (req, res, next) {
  const response = await Post.find({}).catch(next);
  console.log(response);
  res.json(response);
});

router.post(
  '/posts',
  body('title', 'Blog title is required').trim().isLength({ min: 1 }).escape(),
  body('body', 'Blog body is required.').trim().isLength({ min: 1 }).escape(),
  async function (req, res, next) {
    const errors = validationResult(req);

    console.log(req.body);
    const errorMsgs = errors.array().map((error) => error.msg);
    console.log(errors);
    if (!errors.isEmpty()) {
      res.status(422).json({ error: `Invalid request format.`, messages: errorMsgs });
      return;
    }

    const post = new Post({
      title: req.body.title,
      body: req.body.title,
      author: req.body.authorId,
    });

    const response = await post.save().catch((err) => {
      res.status(404).json(err);
      next(err);
    });
    console.log(response);

    const userResponse = await User.findByIdAndUpdate(req.body.authorId, {
      $push: { posts: response._id },
    }).catch(next);
    console.log(userResponse);

    res.status(200).json({ response: 'Post Created', post: response });
  }
);

module.exports = router;
