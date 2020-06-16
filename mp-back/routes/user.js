let User = require('../models/user');

/*
    GET request that queries for all users
    /user
*/
function getUsers(req, res) {
  let query = User.find({});
  query.exec((err, users) => {
    if (err) res.send(err);
    else res.json(users);
  });
}
/*
    POST request to save a new user
    /user
 */
function postUser(req, res) {
  var newUser = new User(req.body);
  newUser
    .save()
    .then((user) => {
      res.status(200).json({ user: 'User Added Successfully' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

/*
    GET request for user by id
    /user/:id
*/
function getUser(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (err) res.send(err);
    else res.json(user);
  });
}

/*
    DELETE request for user
    /user/:id
*/
function deleteUser(req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, (err, user) => {
    if (err) res.json(err);
    else res.json({ message: 'User removed successfully', user });
  });
}

/*
    PUT request for user
    /user/:id
*/
function updateUser(req, res) {
  User.findById({ _id: req.params.id }, (err, user) => {
    if (err) res.send(err);
    Object.assign(user, req.body).save((err, user) => {
      if (err) res.send(err);
      res.json({ message: 'User updated!', user });
    });
  });
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  updateUser,
};
