var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('reservations');

module.exports = router;