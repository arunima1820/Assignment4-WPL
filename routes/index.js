var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('properties');
var collection_resrv = db.get('reservations');


router.get('/', function (req, res, next) {
  res.redirect('/properties');
});

router.get('/properties', function (req, res) {
  collection.find({}, function (err, properties) {
    if (err) throw err;
    res.render('index', { properties: properties });
  });
});


router.post('/properties/delete/:id', function (req, res) {
  collection.remove({ '_id': req.params.id }, function (err, property) {
    if (err) throw err;
    res.redirect('/properties')
  })
})

router.get('/properties/update/:id', function (req, res) {
  collection.findOne({ _id: req.params.id }, function (err, property) {
    if (err) throw err;
    res.render('update', { property: property });
  });
});


router.put('/properties/:id', function (req, res) {
  collection.findOneAndUpdate({ '_id': req.params.id },
  {
    $set: req.body
  },
  function (err, result) {
    if (err) throw err;
    res.redirect('/properties');
  });
})


router.post('/properties/update/:id', function (req, res) {
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
});


router.get('/properties/new', function (req, res) {
  res.render('new');

});

router.get('/properties/:id', function (req, res) {
  collection.findOne({ _id: req.params.id }, function (err, property) {
    if (err) throw err;
    res.render('show', { property: property });
  });
});


router.post('/properties', function (req, res) {
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
  }, function (err, property) {
    if (err) throw err;
    // if insert is successfull, it will return newly inserted object
    //res.json(video);
    res.redirect('/properties');
  });
});


router.get('/reservations/new', function(req, res) {
  res.render('new_reservation')

});

router.get('/reservations', function(req, res, then) {
  collection_resrv.find({guestID: req.query.userID}, function (err, reservations) {
    if (err) throw err;
    // reservations.forEach(reservation => {
    //     db.collection('properties').findOne({'_id' : reservation.propertyID }, 
    //     function(err, property) {
    //       if (err) throw err;
    //       data.append({ ...reservation, ...property})
    //       console.log(data)
    //     }
    //       )
    // })

    db.collection('users').findOne({'_id' : req.query.userID }, function (err, user) {
      if (err) throw err;

      res.render('reservations', { reservations : reservations, user: user})
          // res.json(reservations);

    })
    

  });
}) 

router.post('/reservations/delete/:id', function (req, res) {
  collection_resrv.remove({ _id: req.params.id }, function (err, reservation) {
    if (err) throw err;
    res.redirect('/properties');
  });
})

router.delete('/reservations/:id', function (req, res) {
  collection_resrv.remove({ _id: req.params.id }, function (err, reservation) {
    if (err) throw err;
    res.redirect('/properties');
  });
});



router.get('/reservations/:id', function(req, res) {
  collection_resrv.findOne({ '_id': req.params.id}, function(err, reservation ){
      if (err) throw err;
      // res.json(reservations);
      res.render('showReservation', {reservation : reservation})
      });
});
  

router.get('/reservations/:id', function (req, res) {
  var data = {}
  collection_resrv.findOne({ _id: req.params.id }, function (err, reservation) {
    if (err) throw err;
    data[reservation] = reservation

  });
  collection.findOne({ _id: data[reservation].propertyID }, function (err, property) {
    if (err) throw err;
    data[property] = property
  });
  res.render('showReservation', data ); 
  console.log(data)

  
});

router.post('/reservations', function (req, res) {
  
  collection_resrv.insert({
    guest_id: req.query.userId,
    check_in_date: req.body.check_in_date,
    check_out_date: req.body.check_out_date,
    amount_due: req.body.amount_due
  }, function (err, reservation) {
    if (err) throw err;
    // if insert is successfull, it will return newly inserted object
    //res.json(video);
    res.redirect('/properties');
  });
});



module.exports = router;
