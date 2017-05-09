const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  num: Number,
  title: String,
  novel: {
    type: String,
    index: true
  },
  content: [String]
});

module.exports = mongoose.model('chapter', chapterSchema, 'chapters'); 