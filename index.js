require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const apiRouter = require('./routes/api');
const passport = require('passport');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());

const mongoDB = process.env.MONGO_URL;
const clientP = mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((m) => m.connection.getClient());
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// app.use(function (req, res, next) {
//   console.log(req.header);
//   next();
// });

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    async function (jwtPayload, cb) {
      console.log(jwtPayload);
      const user = await User.findById(jwtPayload._id).catch((err) => cb(err));

      if (user) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    }
  )
);

app.use(logger('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));

app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);
app.use('/auth', authRouter);

app.use(function errorHandler(err, req, res, next) {
  console.dir(err);
  const errorMsg = err.reason ? err.reason.toString() : { type: err.name, message: err.message };
  res.status(404).json({ error: errorMsg });
});

app.listen(3000, function () {
  console.log(`App listening on port 3000`);
});
