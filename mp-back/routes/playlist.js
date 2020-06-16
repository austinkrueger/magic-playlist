let mongoose = require('mongoose');
let Playlist = require('../models/playlist');

/*
    GET request that queries for all user playlists
    /playlist
*/
function getPlaylists(req, res) {
  let query = Playlist.find({});
  query.exec((err, playlists) => {
    if (err) res.send(err);
    else res.json(playlists);
  });
}
// need GET by USER ID request
/*
    POST request to save a new playlist
    /playlist
 */
function postPlaylist(req, res) {
  var newPlaylist = new Playlist(req.body);
  newPlaylist
    .save()
    .then((playlist) => {
      res.status(200).json({ playlist: 'Added Successfully' });
    })
    .catch((err) => {
      res.status(400).send('Failed to create new record');
    });
}

/*
    GET request for playlist by id
    /playlist/:id
*/
function getPlaylist(req, res) {
  Playlist.findById(req.params.id, (err, playlist) => {
    if (err) res.send(err);
    else res.json(playlist);
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
    if (err) res.send(err);
    Object.assign(playlist, req.body).save((err, playlist) => {
      if (err) res.send(err);
      res.json({ message: 'Playlist updated!', playlist });
    });
  });
}

module.exports = {
  getPlaylists,
  getPlaylist,
  postPlaylist,
  deletePlaylist,
  updatePlaylist,
};
