var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/airbnb');
var collection = db.get('properties');
var collection_resrv = db.get('reservations');
const CryptoJS = require('crypto-js');
var keyWords = CryptoJS.enc.Utf8.parse("123");
var ivWords = CryptoJS.lib.WordArray.create([0, 0]);

const encrypt = (text) => {
  return CryptoJS.DES.encrypt(text, keyWords, { iv: ivWords }).toString(CryptoJS.enc.Utf8);
};

const decrypt = (data) => {
  return CryptoJS.DES.decrypt({ ciphertext: data }, keyWords, { iv: ivWords }).toString(CryptoJS.enc.Utf8);
};

router.get('/', function (req, res, next) {
  res.redirect('/properties');
});

router.get('/properties', function (req, res) {
  collection.find({}, function (err, properties) {
    if (err) throw err;
    res.json(properties)
  });
});

router.put('/properties/:id', function (req, res) {
  collection.findOneAndUpdate({ '_id': req.params.id },
    {
      $set: req.body
    },
    function (err, result) {
      if (err) throw err;
      res.status(200).send(result);
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

router.get('/properties/:id', function (req, res) {
  collection.findOne({ _id: req.params.id }, function (err, property) {
    if (err) throw err;
    res.json(property);
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
    res.redirect('/properties');
  });
});


router.post('/users', function (req, res) {
  db.collection('users').findOne({ 'email': req.body.email }, function (err, user) {
    if (err) throw err;
    if (user?.password != req.body.password)
      res.status(404).send("Incorrect password")
    else
      res.json({ ...user, password: user.password })
  })
})

router.put('/users', function (req, res) {
  console.log(req.body)

  db.collection('users').findOne({ 'email': req.body.email }, function (err, user) {
    if (err) throw err;
    if (user) {
      console.log(user)
      res.status(401).send("User Exists");
    }

    else {
      db.collection('users').insert({
        name: {
          firstName: req.body.firstName,
          lastName: req.body.lastName
        },
        email: req.body.email,
        phoneNumber: req.body.phone,
        address: req.body.address,
        password: req.body.password,
        billingInfo: {},
        type: req.body.type
      },
        function (err, user) {
          if (err) throw err;
          else
            res.json(user)

        })
    }
  })
})


router.get('/reservations', function (req, res, then) {
  collection_resrv.find({ guestID: req.query.userID }, function (err, reservations) {
    if (err) throw err;
    res.json(reservations);
  });
})

router.delete('/reservations/:id', function (req, res) {
  collection_resrv.update({ _id: req.params.id }, { $set: { status: "inactive" } }, function (err, reservation) {
    if (err) throw err;
    res.send("Deleted reservation")
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
  res.render('showReservation', data);
  console.log(data)
});

router.post('/reservations', function (req, res) {
  let body = {
    guestID: req.body.guestID,
    checkInDate: new Date(req.body.checkInDate),
    checkOutDate: new Date(req.body.checkOutDate),
    amountDue: req.body.amountDue,
    status: req.body.status,
    propertyID: req.body.propertyID
  }
  db.collection('reservations').find(
    { 'checkInDate': { '$lte': body.checkInDate }, 'checkOutDate': { '$gte': body.checkOutDate }, 'status': 'active', 'propertyID': body.propertyID },
    function (err, reservations) {
      if (err) throw err;
      if (reservations.length > 0) {
        console.log(reservations)
        res.status(304).json(reservations)
      }
      else {
        db.collection('reservations').insert(body, function (err, reservation) {
          if (err) throw err;
          res.send(reservation)
        });
      }
    })
  // console.log(output)
  // if (output > 0) {
  //   res.status(304).send("Reservation already exists")
  // } else {

});

module.exports = router;
