import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SpotifyPlaylist = new Schema({
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
  collaborative: {
    type: Boolean,
    default: false,
  },
  public: {
    type: Boolean,
    default: false,
  },
  tracks: {
    type: Array,
    default: [],
  },
  spotify_uid: {
    type: String,
    required: true,
  },
});

export default mongoose.model('SpotifyPlaylist', SpotifyPlaylist);
