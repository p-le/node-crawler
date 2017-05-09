const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  novel: String,
  chapter: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Log', logSchema, 'logs');