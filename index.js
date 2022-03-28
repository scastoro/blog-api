require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (err, req, res, next) {
  console.dir(err);
});

app.listen(3000, function () {
  console.log(`App listening on port 3000`);
});
