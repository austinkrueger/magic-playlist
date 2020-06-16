import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SpotifyUser = new Schema({
  email: {
    type: String,
    required: true,
  },
  spotify_uid: {
    type: String,
    required: true,
  },
});

export default mongoose.model('SpotifyUser', SpotifyUser);
