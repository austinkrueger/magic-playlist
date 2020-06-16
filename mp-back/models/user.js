let mongoose = require('mongoose');

const Schema = mongoose.Schema;

let User = new Schema({
  email: {
    type: String,
    required: true,
  },
  spotify_uid: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', User);
