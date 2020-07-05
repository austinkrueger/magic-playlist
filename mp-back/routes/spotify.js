let SpotifyWebApi = require('spotify-web-api-node');
let axios = require('axios');
require('dotenv').config();
let jwt = require('jsonwebtoken');
let fs = require('fs');

// const redirUri =
// 'http://localhost:4200/auth/spotify_login?return_to=playlist_view';
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
      `grant_type=authorization_code&code=${req.body.code}&redirect_uri=${req.body.redirUri}&client_id=${clientId}&client_secret=${clientSecret}`,
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
      const returnData = {
        data: data.body,
        idToken: jwtBearerToken,
        expiresIn: expiresIn,
      };
      res.status(200).json(returnData);
    },
    function (error) {
      res.status(400).send(error);
    }
  );
}

// post to api
function createPlaylist(req, res) {
  spotifyApi.setAccessToken(req.body.token);
  const trackUriList = generateTrackUriList(req.body.playlist.tracks);
  const info = spotifyApi
    .createPlaylist(req.body.playlist.spotify_uid, req.body.playlist.name, {
      description: req.body.playlist.description,
      public: true,
    })
    .then(
      function (data) {
        const playlistId = data.body.id;
        const externalUrl = data.body.external_urls['spotify'];
        return { playlistId, externalUrl };
      },
      function (error) {
        res.status(400).send(error);
        return error;
      }
    );

  // Add tracks to a playlist
  info.then(
    function (parent_data) {
      spotifyApi.addTracksToPlaylist(parent_data.playlistId, trackUriList).then(
        function (data) {
          const responseData = {
            playlistId: parent_data.playlistId,
            externalUrl: parent_data.externalUrl,
            origRespons: data.body,
          };
          res.status(200).json(responseData);
        },
        function (error) {
          res.status(400).send(error);
        }
      );
    },
    function (parent_error) {
      res.status(400).send(parent_error);
    }
  );
}

function generateTrackUriList(tracks) {
  const trackUriList = [];
  tracks.forEach((track) => {
    trackUriList.push(track.uri);
  });

  return trackUriList;
}

// post to api
function searchArtists(req, res) {
  authClient().then((response) => {
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
  authClient().then((response) => {
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
              getSubRelatedArtists(spotifyApi, related[i]['id']).then(
                (sub_data) => {
                  artistList.push(sub_data.body.artists[0]);
                },
                (sub_error) => {
                  // fail silently if no artists found
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
  authClient().then((response) => {
    let client_token = response.data.access_token;
    spotifyApi.setAccessToken(client_token);
    const mainArtistId = req.body.main_artist_id;
    const artistId = req.body.artist_id;
    let trackList = [];
    getTopTracks(spotifyApi, artistId).then(
      (data) => {
        if (artistId === mainArtistId) {
          trackList = trackList.concat(data.body.tracks.splice(0, 6));
          res.status(200).json({ tracks: trackList });
        } else {
          trackList = trackList.concat(data.body.tracks.splice(0, 3));
          res.status(200).json({ tracks: trackList });
        }
      },
      (error) => {
        res.status(400).send(error);
      }
    );
  });
}

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

module.exports = {
  requestToken,
  getMe,
  searchArtists,
  generateTemporaryPlaylistArtistList,
  generateArtistTopTracks,
  createPlaylist,
};
