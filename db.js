config = require('config.json');
var pg = require('pg');

var db = new pg.Client(process.env.DATABASE_URL);
db.connect();

module.exports = db;