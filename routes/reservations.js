var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('reservations');


router.get('/new', function(req, res) {
    res.render('new_reservation')

});



router.delete('/reservations/:id', function (req, res) {
    collection_resrv.remove({ _id: req.params.id }, function (err, reservation) {
      if (err) throw err;
      res.redirect('/properties');
    });
  });
  
  

router.get('/', function(req, res) {
    collection_resrv.find({guestID: req.query.userID}, function (err, reservations) {
      if (err) throw err;
      res.json(reservations); //TODO - show view
    });
  }) 
  

router.get('/:id', function(req, res) {
    collection.findOne({ '_id': req.params.id}, function(err, reservations){
        if (err) throw err;
        // res.json(reservations);
        res.render('showReservation', {reservation : reservations})
        });
});
    

router.post('/', function(req, res) {
    collection.insert({
        guestID: req.query.userId,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate,
        amountDue: req.body.amountDue
      }, function (err, reservation) {
        if (err) throw err;
        // if insert is successfull, it will return newly inserted object
        //res.json(video);
        res.redirect('/properties');
      })
})
module.exports = router;