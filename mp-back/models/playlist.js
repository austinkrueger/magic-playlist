import mongoose from 'mongoose';

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
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Playlist', Playlist);
