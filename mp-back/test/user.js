process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

// let User = require('../models/user');
let User = '';

chai.use(chaiHttp);

describe('Users', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });
  describe('/GET user', () => {
    it('it should GET all the users', (done) => {
      chai
        .request(app)
        .get('/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  // POST user missing email
  describe('/POST user', () => {
    it('it should not POST a user without email field', (done) => {
      let user = {
        spotify_uid: 'wdf893mjf324sfopi23',
      };
      chai
        .request(app)
        .post('/user')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('email');
          res.body.errors.email.should.have.property('kind').eql('required');
          done();
        });
    });

    it('it should not POST a user without spotify_uid field', (done) => {
      let user = {
        email: 'test@test.com',
      };
      chai
        .request(app)
        .post('/user')
        .send(user)
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
  });
});
