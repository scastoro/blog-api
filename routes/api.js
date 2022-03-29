const express = require('express');
const router = express.Router();
const post = require('../models/user');

router.get('/posts', async function (req, res, next) {
  const response = await post.find({}).catch(next);
  console.log(response);
  res.json(response);
});

module.exports = router;
