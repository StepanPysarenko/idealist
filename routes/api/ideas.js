var config = require('config.json');
var express = require('express');
var router = express.Router();
var db = require('db');

router.get('/', getIdeas);
router.post('/', createIdea);
router.delete('/:id', deleteIdea);

module.exports = router;

function getAllIdeas(req, res) {
  db.query('SELECT * FROM ideas WHERE deleted=false ORDER BY id ASC;')
  .on('end', function(result) {
    res.status(200).send(result.rows);
  })
  .on('error', function(err) {
    res.status(404).send();
  });
};

function getIdeas(req, res) {
  getAllIdeas(req, res);
}

function createIdea(req, res) {
  db.query('INSERT INTO ideas(text) VALUES ($1);', [req.body.text])
  .on('end', function(data) {
    getAllIdeas(req, res);
  })
  .on('error', function(err) {
    res.status(404).send();
  });
}

function deleteIdea(req, res) {
  db.query('UPDATE ideas SET deleted=true WHERE id=$1;', [req.params.id])
  .on('end', function(result) {
    getAllIdeas(req, res);
  })
  .on('error', function(err) {
    res.status(404).send();
  });
}