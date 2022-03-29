const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, required: true },
  published: { type: Boolean, default: false },
  comments: [
    {
      body: { type: String, required: true },
      title: { type: String },
      author: { type: String },
    },
  ],
});

module.exports = mongoose.model('Post', PostSchema);
