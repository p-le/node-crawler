const mongoose = require('mongoose');
const winston = require('winston');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/local').then(
  () => winston.info('> MongoDB Connected'),
  (err) => console.log(`> MongoDB Error: ${err}`)
);

module.exports = mongoose.connection;
