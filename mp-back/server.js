import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import SpotifyUser from './controllers/models/SpotifyUser';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/magic-playlist', {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});

router.route('/spotify-users').get((req, res) => {
  SpotifyUser.find((err, users) => {
    if (err) console.log(err);
    else res.json(users);
  });
});

router.route('/spotify-users/:id').get((req, res) => {
  SpotifyUser.findById(req.params.id, (err, user) => {
    if (err) console.log(err);
    else res.json(user);
  });
});

router.route('/spotify-users/add').post((req, res) => {
  let spotifyUser = new SpotifyUser(req.body);
  spotifyUser
    .save()
    .then((user) => {
      res.status(200).json({ user: 'Added Successfully' });
    })
    .catch((err) => {
      res.status(400).send('Failed to create new record');
    });
});

router.route('/spotify-users/update/:id').post((req, res) => {
  SpotifyUser.findById(req.params.id, (err, user) => {
    if (!user) return next(new Error('Could not load document'));
    else {
      user.email = req.body.email;
      user.spotify_uid = req.body.spotify_uid;

      user
        .save()
        .then((user) => {
          res.json('Update complete');
        })
        .catch((err) => {
          res.status(400).send('Update failed');
        });
    }
  });
});

router.route('/spotify-users/delete/:id').get((req, res) => {
  SpotifyUser.findByIdAndRemove({ _id: req.params.id }, (err, user) => {
    if (err) res.json(err);
    else res.json('Removed successfully');
  });
});

app.use('/', router);

app.listen(4000, () => console.log(`Express server running on port 4000`));
