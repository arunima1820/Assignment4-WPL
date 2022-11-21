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


router.put('/'. function () {
    
})
  
module.exports = router;