require('rootpath')();
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var db = require('db');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// app.use('/api', expressJwt({ secret: process.env.SECRET }).unless({ 
//   path: [
//     { url: '/api/ideas', methods: ['GET', 'POST'] },
//     // { url: '/^\/api\/ideas\/([0-9]+)$/', methods: ['GET'] },
//     { url: '/api/auth', methods: ['POST'] },
//     { url: '/api/users', methods: ['POST'] },
//     { url: '/api/categories', methods: ['GET'] }  
//   ] 
// }));
app.use('/api', expressJwt({ secret: process.env.SECRET, credentialsRequired: false }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ message: 'Invalid or expired token.'});
  }
});

app.use(express.static('./public'));
app.use('/', require('./routes/index'));
// app.use(function (req, res, next) {
//   console.log(req.user);
//   next();
// });
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/ideas', require('./routes/api/ideas'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/categories', require('./routes/api/categories'));

app.all('*', function(req, res) {
  res.redirect('/');
});

var port = process.env.PORT;
var server = app.listen(port, function () {
  console.log("App is listening on port " + port);
});                      
