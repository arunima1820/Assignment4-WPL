var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('properties');

router.get('/', function(req, res, next) {
  res.redirect('/properties');
});

  router.get('/properties', function(req, res) {
    collection.find({}, function(err, properties){
    if (err) throw err;
     res.render('index', { properties : properties });
    });
    });
  

    router.post('/properties/delete/:id', function(req, res) {
      collection.remove({'_id': req.params.id }, function(err, property) {
        if (err) throw err;
        res.redirect('/properties')
      })
    })

    router.get('/properties/update/:id', function(req, res) {
      collection.findOne({ _id: req.params.id }, function(err, property){
        if (err) throw err;
        res.render('update', { property : property });
        });
    });

    router.post('/properties/update/:id', function(req, res) {
      collection.findOneAndUpdate({'_id': req.params.id }, 
      {$set: 
        { 
          title: req.body.title,
          description: req.body.desc,
          pricePerNight: req.body.pricePerNight,
          serviceFee: req.body.serviceFee,
          cleaningFee: req.body.cleaningFee,
          bedrooms: req.body.bedrooms,
          beds: req.body.beds,
          bathrooms: req.body.bathrooms,
          location: {
            city: req.body.city,
            state: req.body.state,
            country: req.body.country
          },
          pets: req.body.pets,
          smoking: req.body.smoking,
          propertyType: req.body.propertyType,
          img: req.body.image,
        }
      }, 
      function(err, result){
        if (err) throw err;
        res.redirect('/properties');
      });
    });


  router.get('/properties/new', function(req, res) {
    res.render('new');
  
  });

  router.get('/properties/:id', function(req, res) {
    collection.findOne({_id: req.params.id }, function(err, property){
    if (err) throw err;
    res.render('show', { property : property });
    });
  });
  
  
router.post('/properties', function(req, res) {
	collection.insert({ 
		title: req.body.title,
    description: req.body.desc,
    pricePerNight: req.body.pricePerNight,
    serviceFee: req.body.serviceFee,
    cleaningFee: req.body.cleaningFee,
    bedrooms: req.body.bedrooms,
    beds: req.body.beds,
    bathrooms: req.body.bathrooms,
    location: {
      city: req.body.city,
      state: req.body.state,
      country: req.body.country
    },
    pets: req.body.pets,
    smoking: req.body.smoking,
    propertyType: req.body.propertyType,
		img: req.body.image,
	}, function(err, property){
		if (err) throw err;
		res.redirect('/properties');
	});
});



module.exports = router;
