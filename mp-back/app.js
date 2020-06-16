let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let morgan = require('morgan');
let config = require('config');
let user = require('./routes/user');
let playlist = require('./routes/playlist');

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

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => res.json({ message: 'magic-playlist api' }));

app.route('/user').get(user.getUsers).post(user.postUser);
app
  .route('/user/:id')
  .get(user.getUser)
  .delete(user.deleteUser)
  .put(user.updateUser);

// app.route('/user/:user_id/playlists').get(playlist.getUserPlaylists).post(playlist.postUserPlaylist);
// app.route('/user/:user_id/playlist/:playlist_id').get(playlist.getUserPlaylist)

app.route('/playlist').get(playlist.getPlaylists).post(playlist.postPlaylist);

app
  .route('/playlist/:id')
  .get(playlist.getPlaylist)
  .delete(playlist.deletePlaylist)
  .put(playlist.updatePlaylist);

app.listen(4000, () => console.log(`Express server running on port 4000`));

module.exports = app; // for testing
