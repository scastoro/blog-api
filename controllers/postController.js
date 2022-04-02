const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.all_posts = async function (req, res, next) {
  const response = await Post.find({})
    .populate({ path: "author", select: "username -_id" })
    .catch(next);
  console.log(response);
  res.json(response);
};

// TODO: figure out how to get author id (from params or from hidden field on form)
exports.add_post = [
  body("title", "Blog title is required").trim().isLength({ min: 1 }).escape(),
  body("body", "Blog body is required.").trim().isLength({ min: 1 }).escape(),
  async function (req, res, next) {
    const errors = validationResult(req);

    console.log(req.body);
    const errorMsgs = errors.array().map((error) => error.msg);
    console.log(errors);
    if (!errors.isEmpty()) {
      res
        .status(422)
        .json({ error: `Invalid request format.`, messages: errorMsgs });
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

    res.status(200).json({ response: "Post Created", post: response });
  },
];

exports.get_post = async function (req, res, next) {
  const postResponse = await Post.findById(req.params.postId).catch(next);

  console.log(postResponse);

  if (postResponse === null) {
    res.status(404).json({ response: "Post not found" });
  } else if (postResponse) {
    res.status(200).json(postResponse);
  }
};

// Publish post
exports.publish_post = async function (req, res, next) {
  const post = await Post.findById(req.params.postId).catch(next);
  if (!post) {
    res.status(404).json({ response: "Post not found" });
    return;
  }
  post.published = !post.published;
  const response = await post.save().catch(next);
  console.log(response);
  if (response) {
    res.status(200).json({ response: "Post updated", post: response });
  }
};

exports.update_post = [
  body("title", "Blog title is required").trim().isLength({ min: 1 }).escape(),
  body("body", "Blog body is required.").trim().isLength({ min: 1 }).escape(),
  async function (req, res, next) {
    const errors = validationResult(req);

    console.log(req.body);
    const errorMsgs = errors.array().map((error) => error.msg);
    console.log(errors);
    if (!errors.isEmpty()) {
      res
        .status(422)
        .json({ error: `Invalid request format.`, messages: errorMsgs });
      return;
    }

    const response = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        title: req.body.title,
        body: req.body.body,
      },
      { new: true }
    ).catch((err) => {
      res.status(404).json(err);
      next(err);
    });
    console.log(response);

    if (response === null) {
      res.status(404).json({ response: "Post not found" });
    } else if (response) {
      res.status(200).json({ response: "Post Updated", post: response });
    }
  },
];

exports.delete_post = async function (req, res, next) {
  const response = await Post.findByIdAndDelete(req.params.postId).catch(next);

  if (response === null) {
    res.status(404).json({ response: "Post not found" });
  } else if (response) {
    res.status(200).json({ response: "Post deleted" });
  }
};
