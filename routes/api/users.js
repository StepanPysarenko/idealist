var config = require('config.json');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('db');

router.get('/', getAllUsers);
router.post('/', registerUser);

module.exports = router;

function getAllUsers(req, res) {
  db.query('SELECT * FROM users ORDER BY id ASC;')
  .on('end', function(result) {
    res.status(200).send(result.rows);
  })
  .on('error', function(err) {
    res.status(404).send();
  });
};


function registerUser(req, res) {
  db.query('SELECT * FROM users WHERE username=$1 LIMIT 1;', [req.body.username])
  .on('end', function(result) {

    var user = result.rows[0];
    if(user) {
      res.status(400).send({ message: 'Username is already taken.' });
    } else {

      bcrypt.hash(req.body.password, 10)
      .then(function(hash) {

        db.query(
          'INSERT INTO users(username, email, password) VALUES ($1, $2, $3)', 
          [req.body.username, req.body.email, hash]
        )
        .on('end', function(result) {
          res.status(200).send();
        })
        .on('error', function(err) {
          res.status(400).send();
        });

      })

    } 

  })
  .on('error', function(err) {
    res.status(400).send();
  });

  // User.findOne({ username: req.body.username })
  //   .then(function (user) {
  //     if(user) {
  //       res.status(400).send({ message: 'Username is already taken.' });
  //     } else {
  //       bcrypt.hash(req.body.password, 10)
  //         .then(function(hash) {
  //           return User.create({
  //             username: req.body.username,
  //             email: req.body.email,
  //             password: hash
  //           });
  //         })
  //         .then(function (user) {
  //           res.status(200).send();
  //         });
  //     } 
  //   })
  //   .catch(function (err) {
  //     res.status(400).send();
  //   });
}
