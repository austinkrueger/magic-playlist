import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let SpotifyUser = new Schema({
  email: {
    type: String,
  },
  spotify_uid: {
    type: String,
  },
});

export default mongoose.model('SpotifyUser', SpotifyUser);
