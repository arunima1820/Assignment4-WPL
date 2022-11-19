var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('properties');
router.get('/', function(req, res) {
collection.find({}, function(err, properties){
if (err) throw err;
 res.json(properties);
});
});

router.get('/:id', function(req, res) {
    collection.findOne({_id: req.params.id }, function(err, property){
    if (err) throw err;
     res.json(property);
    });
    });
    
module.exports = router;