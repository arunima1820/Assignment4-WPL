var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('properties');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next) {
  res.redirect('/properties');
});

router.get('/properties', function(req, res) {
  collection.find({}, function(err, properties){
  if (err) throw err;
   res.render('index', { properties : properties });
  });
  });

module.exports = router;
