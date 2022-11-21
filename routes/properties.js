var express = require('express');
var router = express.Router();
//var propertiesJSON = require("../properties.json")

var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('properties');


router.get('/', function(req, res) {
    collection.find({}, function(err, properties){
    if (err) throw err;
    res.json(properties);
    });
    // if (err) throw err;
    // res.render('index', { properties : propertiesJSON }); // instead it'd be properties:propertes when working from mongodb
  
});

router.get('/:id', function(req, res) {
    collection.findOne({_id: req.params.id }, function(err, property){
    if (err) throw err;
     res.json(property);
    });
});
    


router.delete('/:id', function (req, res) {
    collection.remove({ '_id': req.params.id }, function (err, property) {
      if (err) throw err;
      res.redirect('/properties')
    })
  })


router.put('/:id', function () {
    collection.findOneAndUpdate({ '_id': req.params.id },
    {
      $set:
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
    function (err, result) {
      if (err) throw err;
      res.redirect('/properties');
    });
})
  
module.exports = router;