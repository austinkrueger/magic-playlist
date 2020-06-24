let SpotifyWebApi = require('spotify-web-api-node');
let axios = require('axios');
require('dotenv').config();
let spotifyService = require('../services/spotify');
let jwt = require('jsonwebtoken');
let fs = require('fs');

const redirUri = 'http://localhost:4200/auth/spotify_login';
const clientId = process.env.SPOTIFY_API_CLIENT;
const clientSecret = process.env.SPOTIFY_API_SECRET;

const RSA_PRIVATE_KEY = fs.readFileSync('./config/jwtRS256.key');

var spotifyApi = new SpotifyWebApi();
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
function getMe(req, res) {
  spotifyApi.setAccessToken(req.body.token);
  spotifyApi.getMe().then(
    function (data) {
      // create our jwt token for accessing data
      const expiresIn = 2400;
      const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: expiresIn,
        subject: data.body.id,
      });
      // console.log('Some information about the authenticated user', data.body);
      const returnData = {
        data: data.body,
        idToken: jwtBearerToken,
        expiresIn: expiresIn,
      };
      res.status(200).json(returnData);
    },
    function (error) {
      console.log('Something went wrong!', error);
      res.status(400).send(error);
    }
  );
}

// post to api
function createPlaylist() {}

// post to api
function searchArtist() {}

// post to api
function searchArtists(req, res) {
  spotifyService.authClient().then((response) => {
    let client_token = response.data.access_token;
    spotifyApi.setAccessToken(client_token);
    spotifyApi.searchArtists(req.body.search_term).then(
      function (data) {
        res.status(200).json(data.body);
      },
      function (error) {
        res.status(400).send(error);
      }
    );
  });
}

// post to api, create temporary playlist from data
function generateTemporaryPlaylistArtistList(req, res) {
  spotifyService.authClient().then((response) => {
    let client_token = response.data.access_token;
    spotifyApi.setAccessToken(client_token);
    spotifyApi.getArtistRelatedArtists(req.body.artist_id).then(
      (data) => {
        let related = data.body.artists;
        const artistList = [req.body.artist_id];
        for (let i = 0; i < related.length; i++) {
          if (artistList.length < 9) {
            if (artistList.includes(related[i]['id'])) {
              i++;
            } else {
              artistList.push(related[i]['id']);
              spotifyService
                .getSubRelatedArtists(spotifyApi, related[i]['id'])
                .then(
                  (sub_data) => {
                    artistList.push(sub_data.body.artists[0]);
                  },
                  (sub_error) => {
                    console.log('sub error', sub_error);
                  }
                );
            }
          } else {
            res.status(200).json({ artists: artistList });
            break;
          }
        }
      },
      (error) => {
        res.status(400).send(error);
      }
    );
  });
}

function generateArtistTopTracks(req, res) {
  spotifyService.authClient().then((response) => {
    let client_token = response.data.access_token;
    spotifyApi.setAccessToken(client_token);
    const mainArtistId = req.body.main_artist_id;
    const artistId = req.body.artist_id;
    let trackList = [];
    spotifyService.getTopTracks(spotifyApi, artistId).then(
      (data) => {
        // console.log('TRACKLIST LENGTH ---------', trackList.length);
        if (artistId === mainArtistId) {
          trackList = trackList.concat(data.body.tracks.splice(0, 6));
          res.status(200).json({ tracks: trackList });
        } else {
          trackList = trackList.concat(data.body.tracks.splice(0, 3));
          res.status(200).json({ tracks: trackList });
        }
      },
      (error) => {
        console.log('tracks error', error);
        res.status(400).send(error);
      }
    );
  });
}

// post to api
function getArtistRelatedArtists() {}

// post to api
function getArtistTopSongs() {}

module.exports = {
  requestToken,
  getMe,
  searchArtists,
  generateTemporaryPlaylistArtistList,
  generateArtistTopTracks,
};
