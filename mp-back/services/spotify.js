let SpotifyWebApi = require('spotify-web-api-node');
let axios = require('axios');
require('dotenv').config();

const clientId = process.env.SPOTIFY_API_CLIENT;
const clientSecret = process.env.SPOTIFY_API_SECRET;

function authClient() {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
  };
  return axios.post(
    'https://accounts.spotify.com/api/token',
    `grant_type=client_credentials`,
    config
  );
}

function getSubRelatedArtists(api, artist_id) {
  return api.getArtistRelatedArtists(artist_id);
}

function getTopTracks(api, artist_id) {
  return api.getArtistTopTracks(artist_id, 'US');
}

module.exports = { authClient, getSubRelatedArtists, getTopTracks };
