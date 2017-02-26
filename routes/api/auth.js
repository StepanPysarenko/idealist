var config = require('config.json');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var db = require('db');

router.post('/', authenticateUser);
router.get('/decoded', tokenDecoded);

module.exports = router;

function authenticateUser(req, res) {
  db.query('SELECT * FROM users WHERE username=$1 LIMIT 1;', [req.body.username])
  .on('end', function(result) {
    var user = result.rows[0];
    if (user) {
      bcrypt.compare(req.body.password, user.password)
        .then(function (equal) {
          if (equal) {
            var token = jwt.sign({ 'sub' : user.username }, process.env.SECRET, { expiresIn: '1h' });
            res.json({'token' : token});   
          } else {
            res.status(400).send({ message: 'Invalid credentials.' });
          }
        });
    } else {
      res.status(400).send({ message: 'Invalid credentials.' });
    }   
  })
  .on('error', function(err) {
    res.status(400).send({ message: 'Invalid credentials.' });
  });
}

function tokenDecoded(req, res) {
  res.status(200).send(req.user);
}
