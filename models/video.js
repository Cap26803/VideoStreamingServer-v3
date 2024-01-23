// models/video.js

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filename: String,
  path: String,
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;