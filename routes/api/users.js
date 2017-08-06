var config = require('config.json');
var express = require('express');
var router = express.Router();
var db = require('db');
var bcrypt = require('bcrypt');

router.post('/', registerUser);

module.exports = router;

function registerUser(req, res) {
  var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
  // var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; //Minimum 8 characters at least 1 Alphabet and 1 Number
  //var errors = {};

  var forbiddenUsernames = ['annonymus', 'admin', 'user'];

  if(forbiddenUsernames.indexOf(req.body.username.toLowerCase()) > -1) {
    res.status(400).send({ message: 'Username is forbidden.' });
  } else if(!emailRegex.test(req.body.email)) {
    res.status(400).send({ message: 'Invalid email.' });
  } else {
    db.query('SELECT * FROM account WHERE LOWER(username) LIKE LOWER($1) LIMIT 1;', [req.body.username])
      .on('end', function(result) {
        if(result.length > 0) {
          res.status(400).send({ message: 'Username is already taken.' });
        } else {
          bcrypt.hash(req.body.password, 10).then(function(hash) {
            db.query('INSERT INTO account(username, email, password) VALUES ($1, $2, $3)',
              [req.body.username, req.body.email, hash])
              .on('end', function(result) {
                res.status(200).send({ message: 'User successfully registered.' });
              })
              .on('error', function(err) {
                res.status(500).send();
              });
          })
        } 
      })
      .on('error', function(err) {
        res.status(500).send();
      });
  }

}
