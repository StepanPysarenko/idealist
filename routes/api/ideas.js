var config = require('config.json');
var express = require('express');
var router = express.Router();
var db = require('db');

router.get('/', getIdeas);
router.post('/', createIdea);
router.delete('/:id', deleteIdea);

module.exports = router;

function getIdeas(req, res) {
  const queryString = `SELECT 
      i.idea_id as id, 
      i.name, 
      i.description,
      i.created_at,
      c.name as category 
    FROM idea i INNER JOIN category c
    ON i.category_id=c.category_id
    WHERE is_deleted=false 
    ORDER BY i.created_at DESC;`
  db.query(queryString)
  .on('end', function(result) {
    res.status(200).send(result.rows);
  })
  .on('error', function(err) {
    console.log(err);
    res.status(404).send();
  });
};

function createIdea(req, res) {
  db.query('INSERT INTO idea(name, description, category_id) VALUES ($1, $2, $3);', 
    [req.body.name, req.body.description, req.body.category]
    )
  .on('end', function(data) {
    getIdeas(req, res);
  })
  .on('error', function(err) {
    res.status(404).send();
  });
}

function deleteIdea(req, res) {
  db.query('UPDATE idea SET is_deleted=true WHERE idea_id=$1;', [req.params.id])
  .on('end', function(result) {
    getIdeas(req, res);
  })
  .on('error', function(err) {
    res.status(404).send();
  });
}