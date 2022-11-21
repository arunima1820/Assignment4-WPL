var express = require('express');
//var propertiesJSON = require("../properties.json")
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/wpl-assign4');
var collection = db.get('properties');
var collection_resrv = db.get('reservations');


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
	res.render('index', { properties : properties }); // instead it'd be properties:propertes when working from mongodb
	});

//   if (err) throw err;
//   res.render('index', { properties : propertiesJSON }); // instead it'd be properties:propertes when working from mongodb

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
		res.redirect('/properties');
	});
});

router.post('/reservations', function(req, res) {
	collection_resrv.insert({ 
		guest_id: req.body.guest_id,
		check_in_date: req.body.check_in_date,
		check_out_date: req.body.check_out_date,
		amount_due:req.body.amount_due
	}, function(err, video){
		if (err) throw err;
		// if insert is successfull, it will return newly inserted object
	  	//res.json(video);
		res.redirect('/properties');
	});
});



module.exports = router;
