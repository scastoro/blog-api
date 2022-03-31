require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username: username }).catch((err) => done(err));
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password' });
    }
    const response = await bcrypt.compare(password, user.password).catch((err) => done(err));

    if (response) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect Password' });
    }
  })
);

const router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false, failWithError: true }),
  function (req, res, next) {
    req.login(req.user, { session: false }, (err) => {
      if (err) {
        res.status(403).json({ response: 'Access denied', error: err });
      }
      console.log(req.user);
      const token = jwt.sign(req.user.toJSON(), process.env.SECRET);
      return res.status(200).json({ response: 'Access granted', user: req.user, token });
    });
  }
);

router.post(
  '/signup',
  body('username', 'Username must exist').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password must exist').trim().isLength({ min: 1 }).escape(),
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(404).json({ response: 'Validation Error', errors: errors.Array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10).catch(next);

    console.log(hashedPassword);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    const response = await user.save().catch(next);

    if (response) {
      console.log(response);
      res.redirect('/');
    }
  }
);

module.exports = router;
