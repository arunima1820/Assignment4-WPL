var express = require('express');
var router = express.Router();
//var propertiesJSON = require("../properties.json")

var monk = require('monk');
// var db = monk('localhost:27017/wpl-assign4');
var db = monk('localhost:27017/airbnb');

var collection = db.get('favorites');

module.exports = router;