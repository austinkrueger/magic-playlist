let SpotifyWebApi = require('spotify-web-api-node');
let axios = require('axios');
require('dotenv').config();

const redirUri = 'http://localhost:4200/auth/spotify_login';
const clientId = process.env.SPOTIFY_API_CLIENT;
const clientSecret = process.env.SPOTIFY_API_SECRET;
/*
    GET request with data from Spotify Login
*/
function requestToken(req, res) {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  axios
    .post(
      'https://accounts.spotify.com/api/token',
      `grant_type=authorization_code&code=${req.body.code}&redirect_uri=${redirUri}&client_id=${clientId}&client_secret=${clientSecret}`,
      config
    )
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(400).send(error);
    });
}

// get authenticated user with api
function getMe(req, res) {}

// post to api
function createPlaylist() {}

// post to api
function searchArtist() {}

// post to api
function getArtist() {}

// post to api
function getArtistRelatedArtists() {}

// post to api
function getArtistTopSongs() {}

module.exports = { requestToken, getMe };
