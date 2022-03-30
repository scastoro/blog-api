const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

// Get all comments on post
exports.get_all_comments = async function (req, res, next) {
  const comments = await Post.findById(req.params.postId).select('comments -_id').catch(next);
  console.log(comments);
  if (comments === null) {
    res.status(404).json({ response: 'Post not found' });
  } else if (comments) {
    res.status(200).json(comments);
  }
};
// Get one comment
exports.get_comment = async function (req, res, next) {
  const response = await Post.findById(req.params.postId).catch(next);
  if (!response) {
    return res.status(404).json({ response: 'Post not found.' });
  }
  const comment = response.comments.id(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ response: 'Comment not found.' });
  } else if (comment) {
    return res.status(200).json(comment);
  }
};

// Add comment
exports.add_comment = [
  body('title').trim().escape(),
  body('body', 'Post body is required.').trim().isLength({ min: 1 }).escape(),
  async function (req, res, next) {
    const errors = validationResult(req);
    const errorMsgs = errors.array().map((error) => error.msg);

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ response: 'Request is not properly formatted', errors: errorMsgs });
    }
    const response = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: {
          comments: {
            title: req.body.title,
            body: req.body.body,
          },
        },
      },
      { new: true }
    ).catch(next);

    console.log(response.comments);

    if (response === null) {
      return res.status(404).json({ response: 'Post not found.' });
    } else if (response) {
      return res.status(200).json(response.comments);
    }
  },
];

// Edit comment
exports.edit_comment = [
  body('title').trim().escape(),
  body('body', 'Post body is required.').trim().isLength({ min: 1 }).escape(),
  async function (req, res, next) {
    const errors = validationResult(req);
    const errorMsgs = errors.array().map((error) => error.msg);

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ response: 'Request is not properly formatted', errors: errorMsgs });
    }
    const post = await Post.findById(req.params.postId).catch(next);
    console.log(`Post: ${post}`);
    const comment = post.comments.id(req.params.commentId);
    comment.title = req.body.title;
    comment.body = req.body.body;
    const response = await post.save().catch(next);

    console.log(response);

    if (response === null) {
      return res.status(404).json({ response: 'Post not found.' });
    } else if (response) {
      return res.status(200).json(response.comments.id(req.params.commentId));
    }
  },
];
// Delete comment
exports.delete_comment = async function (req, res, next) {
  const response = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { comments: { _id: req.params.commentId } },
    },
    { new: true }
  ).catch(next);

  console.log(response);

  if (response === null) {
    return res.status(404).json({ response: 'Post or comment not found' });
  } else if (response) {
    return res.status(200).json(response);
  }
};
