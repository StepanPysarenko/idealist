var config = require('config.json');
var express = require('express');
var router = express.Router();
var db = require('db');
var bcrypt = require('bcrypt');

router.post('/', registerUser);

module.exports = router;

function registerUser(req, res) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if(!re.test(req.body.email))
    res.status(400).send({ message: 'Invalid email.' });
  else {

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
            res.status(400).send({ message: 'Invalid credentials.' });
          });

        })

      } 

    })
    .on('error', function(err) {
      res.status(400).send();
    });

  }

}
