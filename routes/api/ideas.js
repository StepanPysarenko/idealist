var config = require('config.json');
var express = require('express');
var router = express.Router();
var db = require('db');

router.get('/', getIdeas);
router.get('/:id([0-9]+)', getIdea);
router.post('/', createIdea);
router.delete('/:id([0-9]+)', deleteIdea);

module.exports = router;

function getIdeas(req, res) {
  var page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  var limit = parseInt(req.query.limit, 10);
  if (isNaN(limit)) {
    limit = 10;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }

  // var count = 0; // TODO: diltering
  var offset = (page - 1) * limit;

  const queryString = `SELECT 
      i.id, 
      i.name, 
      i.description,
      i.created_at,
      c.name as category_name
    FROM idea i INNER JOIN category c
    ON i.category_id=c.id
    --WHERE is_deleted=false
    ORDER BY i.created_at DESC
    --OFFSET $1 LIMIT $2;`
  
  

  db.query(queryString) //, [offset, limit])
    .on('end', function(result) {
      res.status(200).send(result.rows);
    })
    .on('error', function(err) {
      console.log(err);
      res.status(500).send();
    });
};

function getIdea(req, res) {
  const queryString = `SELECT 
      i.id, 
      i.name, 
      i.description,
      i.created_at,
      c.name as category_name
    FROM idea i
    WHERE i.id=$1;`

  db.query(queryString, [req.params.id])
    .on('end', function(result) {
      if (result.rows.length == 0) {
        res.status(404).send();
      }
      res.status(200).send(result.rows[0]);
    })
    .on('error', function(err) {
      console.log(err);
      res.status(500).send();
    });
};

function createIdea(req, res) {
  const queryString = 'INSERT INTO idea(name, description, category_id) VALUES ($1, $2, $3);'

  db.query(queryString, [req.body.name, req.body.description, req.body.category])
    .on('end', function(data) {
      getIdeas(req, res);
    })
    .on('error', function(err) {
      res.status(500).send();
    });
}

function deleteIdea(req, res) {
  res.status(200).send();
  /*db.query('UPDATE idea SET is_deleted=true WHERE id=$1;', [req.params.id])
    .on('end', function(result) {
      getIdeas(req, res);
    })
    .on('error', function(err) {
      res.status(500).send();
    });*/
}
