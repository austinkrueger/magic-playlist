let Playlist = require('../models/playlist');

/*
    GET request that queries for all user playlists
    /playlist
*/
function getPlaylists(req, res) {
  let query = Playlist.find({ spotify_uid: req.query.user_id });
  query.exec((err, playlists) => {
    if (err) {
      // console.log(err);
      res.status(400).send(err);
    } else {
      // console.log(playlists);
      res.status(200).json(playlists);
    }
  });
}
// need GET by USER ID request
/*
    POST request to save a new playlist
    /playlist
 */
function postPlaylist(req, res) {
  var newPlaylist = new Playlist(req.body.playlist);
  newPlaylist
    .save()
    .then((playlist) => {
      res.status(200).json({ playlist: 'Playlist Added Successfully' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

/*
    GET request for playlist by id
    /playlist/:id
*/
function getPlaylist(req, res) {
  Playlist.findById(req.params.id, (err, playlist) => {
    if (err) res.status(400).send(err);
    else res.status(200).json(playlist);
  });
}

/*
    DELETE request for playlist
    /playlist/:id
*/
function deletePlaylist(req, res) {
  Playlist.findByIdAndRemove({ _id: req.params.id }, (err, playlist) => {
    if (err) res.json(err);
    else res.json({ message: 'Playlist removed successfully', playlist });
  });
}

/*
    PUT request for playlist
    /playlist/:id
*/
function updatePlaylist(req, res) {
  Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    if (err) res.status(400).send(err);

    if (!playlist) res.status(400).send({ message: 'Playlist not found!' });
    else {
      playlist.name = req.body.playlist.name;
      playlist.description = req.body.playlist.description;
      playlist.tracks = req.body.playlist.tracks;
      playlist.url = req.body.playlist.url;
      playlist.public = req.body.playlist.public;
      playlist.collaborative = req.body.playlist.collaborative;

      playlist
        .save()
        .then((playlist) => {
          res.status(200).json({ message: 'Playlist updated!', playlist });
        })
        .catch((err) => {
          res.status(400).send({ message: 'Playlist update failed' });
        });
    }
  });
}

module.exports = {
  getPlaylists,
  getPlaylist,
  postPlaylist,
  deletePlaylist,
  updatePlaylist,
};
