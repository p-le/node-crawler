const mongoose = require('mongoose');

const schema = mongoose.Schema({
  title: String,
  path: String,
  origin: String
});

module.exports = mongoose.model('Novel', schema, 'novels');