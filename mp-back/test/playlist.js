process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

let Playlist = require('../models/playlist');

chai.use(chaiHttp);

describe('Playlist', () => {
  beforeEach((done) => {
    Playlist.remove({}, (err) => {
      done();
    });
  });

  describe('/GET playlists by user', () => {
    it('it should GET all the playlists for a given user', (done) => {
      chai
        .request(app)
        .get('/playlist?user_id=0')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  // POST playlist missing name
  describe('/POST playlist', () => {
    it('it should not POST a playlist without name field', (done) => {
      let playlist = {
        spotify_uid: 'wdf893mjf324sfopi23',
      };
      chai
        .request(app)
        .post('/playlist')
        .send(playlist)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('name');
          res.body.errors.name.should.have.property('kind').eql('required');
          done();
        });
    });

    it('it should not POST a playlist without spotify_uid field', (done) => {
      let playlist = {
        name: 'New Playlist 1',
      };
      chai
        .request(app)
        .post('/playlist')
        .send(playlist)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('spotify_uid');
          res.body.errors.spotify_uid.should.have
            .property('kind')
            .eql('required');
          done();
        });
    });

    it('it should POST a valid playlist', (done) => {
      let playlist = {
        name: 'New Playlist 1',
        spotify_uid: 'wdf893mjf324sfopi23',
      };
      chai
        .request(app)
        .post('/playlist')
        .send(playlist)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('playlist');
          res.body.playlist.should.be.eql('Playlist Added Successfully');
          done();
        });
    });
  });
});
