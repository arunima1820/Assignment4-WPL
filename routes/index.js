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


  router.get('/properties/new', function(req, res) {
    res.render('new');
  
  });
  

//TODO
router.post('/properties', function(req, res) {
	collection.insert({ 
		title: req.body.title,
		genre: req.body.genre,
		img: req.body.image,
		description:req.body.desc
	}, function(err, video){
		if (err) throw err;
		// if insert is successfull, it will return newly inserted object
	  	//res.json(video);
		res.redirect('/videos');
	});
});



module.exports = router;
