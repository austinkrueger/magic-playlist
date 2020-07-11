let mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Playlist = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
  },
  tracks: {
    type: Array,
    default: [],
  },
  spotify_uid: {
    type: String,
    required: true,
  },
  spotify_playlist_id: {
    type: String,
  },
});

module.exports = mongoose.model('Playlist', Playlist);
