const mongoose = require('mongoose');

const schema = mongoose.Schema({
  location: Object,
  name: String,
});

module.exports = mongoose.model('Restaurants', schema);