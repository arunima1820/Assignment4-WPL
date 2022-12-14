var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/wpl-assign4');
// var db = monk('localhost:27017/airbnb');

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

router.get('/properties', function (req, res) {
  let query = {}
  if (req.query.hostID) {
    query = { hostID: req.query.hostID }
  }
  collection.find(query, function (err, properties) {
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
      res.send(result);
    });
})

router.get('/properties/:id', function (req, res) {
  collection.findOne({ _id: req.params.id }, function (err, property) {
    if (err) throw err;
    res.json(property);
  });
});

// router.get('/properties', function (req, res) {
//   db.collection('properties').find({ hostID: req.query.hostID }, function(err, properties) {
//     if (err) throw err
//     res.json(properties)
//   })
// })

router.post('/properties', function (req, res) {
  db.collection('properties').insert({
    title: req.body.title,
    description: req.body.description,
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
    img: req.body.img,
    status: req.body.status,
    hostID: req.body.hostID
  }, function (err, property) {
    if (err) throw err;
    res.json(property);
  });
});

router.delete('/properties/:id', function (req, res) {
  db.collection('properties').update({ _id: req.params.id }, { $set: { status: "inactive" } }, function (err, property) {
    if (err) throw err;
    res.json(property)
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

router.delete('/reservations/:id', function (req, res) {
  db.collection('reservations').update({ _id: req.params.id }, { $set: { status: "inactive" } }, function (err, reservation) {
    if (err) throw err;
    res.send("Deleted reservation")
  });
});


router.get('/reservations', async function (req, res) {
  const reservations = await db.collection('reservations').find({ guestID: req.query.guestID }, function (err, reservations) { if (err) throw err })
  const property = []
  for (let i = 0; i < reservations.length; i++) {
    let data = await db.collection('properties').findOne({ _id: reservations[i].propertyID }, function (err, property) { if (err) throw err })
    property.push({ property: { ...data }, reservation: { ...reservations[i] } })
  }
  res.json(property)
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
});

router.get('/favorites', async function (req, res) {
  const reservations = await db.collection('favorites').find({ guestID: req.query.guestID }, function (err, reservations) { if (err) throw err })
  const property = []
  for (let i = 0; i < reservations.length; i++) {
    let data = await db.collection('properties').findOne({ _id: reservations[i].propertyID }, function (err, property) { if (err) throw err })
    property.push(data)
  }
  // console.log(property)
  res.json(property)
});

router.post('/favorites', function (req, res) {
  db.collection('favorites').update({
    propertyID: req.body.propertyID,
    guestID: req.body.guestID
  }, {
    $set: {
      propertyID: req.body.propertyID,
      guestID: req.body.guestID
    }
  }, {
    upsert: true
  }, function (err, favorite) {
    if (err) throw err;
    res.send();
  });
});


router.put('/favorites', function (req, res) {
  console.log(req.body)
  db.collection('favorites').findOneAndDelete({
    propertyID: req.body.propertyID,
    guestID: req.body.guestID
  }, function (err, favorite) {
    if (err) throw err;
    res.send();
  });
});
module.exports = router;
