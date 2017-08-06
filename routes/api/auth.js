var config = require('config.json');
var express = require('express');
var router = express.Router();
var db = require('db');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('config.json');

router.post('/token', authenticateUser);
router.post('/refresh', refreshToken);
router.get('/decoded', tokenDecoded);

module.exports = router;

function authenticateUser(req, res) {
  db.query('SELECT * FROM account WHERE username=$1 LIMIT 1;', [req.body.username])
  .on('end', function(result) {
    var user = result.rows[0];
    if (user) {
      bcrypt.compare(req.body.password, user.password)
        .then(function (equal) {
          if (equal) {
            db.query('UPDATE account SET reauth=FALSE WHERE username=$1', [req.body.username])
              .on('end', function(result) {
                var token = jwt.sign({ 'sub': user.id }, process.env.SECRET, { expiresIn: config.tokenExpiresIn });   
                res.json({'token' : token});  
              })
              .on('error', function(err) {
                res.status(500).send();
              });               
          } else {
            res.status(400).send({ message: 'Invalid credentials.' });
          }
        });
    } else {
      res.status(400).send({ message: 'Invalid credentials.' });
    }   
  })
  .on('error', function(err) {
    res.status(500).send();
  });
}

function refreshToken(req, res) {
  db.query('SELECT reauth FROM account WHERE id=$1 LIMIT 1;', [req.user.sub])
    .on('end', function(result) {
      if(!result.rows[0].reauth) {
        var token = jwt.sign({ 'sub': req.user.sub }, process.env.SECRET, { expiresIn: config.tokenExpiresIn });   
        res.json({'token' : token});
      } else {
        res.status(403).send({ message: 'Token can not be refreshed. Please reauthenticate.' });
      }      
    })
    .on('error', function(err) {
      res.status(500).send();
    });  
}

function tokenDecoded(req, res) {
  res.status(200).send(req.user);
}
