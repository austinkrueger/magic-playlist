let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');
let config = require('config');
let expressJwt = require('express-jwt');
let fs = require('fs');
let playlist = require('./routes/playlist');
let spotify = require('./routes/spotify');
require('dotenv').config();

const app = express();
app.use(cors());

//db connection
mongoose.connect(config.DBHost, { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

const RSA_PUBLIC_KEY = fs.readFileSync('./config/jwtRS256.key.pub');
const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
});

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => res.json({ message: 'magic-playlist api' }));

app
  .route('/playlist')
  .get(playlist.getPlaylists)
  .post(checkIfAuthenticated, playlist.postPlaylist);

app
  .route('/playlist/:id')
  .get(playlist.getPlaylist)
  .delete(checkIfAuthenticated, playlist.deletePlaylist)
  .put(checkIfAuthenticated, playlist.updatePlaylist);

// spotify api direct
app.route('/auth/request-token').post(spotify.requestToken);
app.route('/api/spotify/me').post(spotify.getMe);
app.route('/api/spotify/search').post(spotify.searchArtists);
app
  .route('/api/spotify/playlist/generate/artists')
  .post(spotify.generateTemporaryPlaylistArtistList);
app
  .route('/api/spotify/playlist/generate/tracks')
  .post(spotify.generateArtistTopTracks);

app.listen(4000, () => console.log(`Express server running on port 4000`));

module.exports = app; // for testing
