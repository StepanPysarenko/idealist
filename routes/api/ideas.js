var config = require('config.json');
var express = require('express');
var router = express.Router();
var db = require('db');

router.get('/', getIdeas);
router.get('/:id([0-9]+)', getIdea);
router.post('/', createIdea);
router.put('/:id([0-9]+)', updateIdea);
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
  } else if (limit > 100) {
    limit = 100;
  } else if (limit < 1) {
    limit = 1;
  }
  
  var offset = (page - 1) * limit;

  // var count = 0; 
  // TODO: filtering

  const queryString = `SELECT 
      i.id as id, 
      i.name as name, 
      i.description as description,
      i.created_at as created_at,
      c.name as category_name,
      a.username as author_name
    FROM idea i 
      INNER JOIN category c ON i.category_id = c.id
      LEFT JOIN account a ON i.author_id = a.id
    ORDER BY i.created_at DESC
    OFFSET $1 LIMIT $2;` 

  db.query(queryString, [offset, limit])
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
      i.id as id, 
      i.name as name, 
      i.description as description,
      i.created_at as created_at,
      c.name as category_name,
      a.username as author_name
    FROM idea i 
      INNER JOIN category c ON i.category_id = c.id
      LEFT JOIN account a ON i.author_id = a.id
    WHERE i.id = $1;`

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

  var user_id = req.user ? req.user.sub : null;

  const queryString = `INSERT INTO 
    idea(name, description, category_id, author_id) 
    VALUES ($1, $2, $3, $4);`

  var queryParams = [req.body.name, 
    req.body.description, 
    req.body.category_id, 
    user_id];

  db.query(queryString, queryParams)
    .on('end', function(data) {
      res.status(200).send();
    })
    .on('error', function(err) {
      res.status(500).send();
    });
}

function updateIdea(req, res) {
  const queryString = `UPDATE idea SET 
    name = $1,
    description = $2,
    category_id = $3,
    updated_at = now()
    WHERE id = $4;`

  var queryParams = [req.body.name, 
    req.body.description, 
    req.body.category_id, 
    req.params.id];

  db.query(queryString, queryParams)
    .on('end', function(data) {
      res.status(200).send();
    })
    .on('error', function(err) {
      res.status(500).send();
    });
}

function deleteIdea(req, res) {
  db.query('DELETE FROM idea WHERE id=$1;', [req.params.id])
    .on('end', function(result) {
      res.status(200).send();
    })
    .on('error', function(err) {
      res.status(500).send();
    });
}
