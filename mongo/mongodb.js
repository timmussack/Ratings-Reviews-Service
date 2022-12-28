const mongoose = require("mongoose");
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

// Use mongoose to establish a connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/reviews', {useNewUrlParser: true, useUnifiedTopology: true});

//mongosh opens mongo in terminal
//use glossary --> from the connect statement at the top
//show collections --> should be words in this case
//db.reviews.find() --> shows are documents in collection
//db.reviews.deleteMany({}) --> deletes all documents in collection

// Set up any needed models
const reviewSchema = new mongoose.Schema({
  'product_id': Number,
  'page': Number,
  'count': Number,
  'results': [
    {
    'review': String,
    'summary': String,
    'recommend': Boolean,
    'response': String,
    'body': String,
    'date': Number,
    'reviewer_name': String,
    'helpfulness': Number,
    'photos': [
      {
        'id': Number,
        'url': String
      }
    ]
    }
  ]
}, {_id: false})

const Review = mongoose.model('Review', reviewSchema);

const metaSchema = new mongoose.Schema({
 'product_id': Number,
  'ratings': {
    '1': Number,
    '2': Number,
    '3': Number,
    '4': Number,
    '5': Number
  },
  'recommended': {
    'false': Number,
    'true': Number
  },
  'characteristics': {
    'type': Map,
    'of': Object
    }
  }, {_id: false})

const Meta = mongoose.model('Meta', metaSchema);

// const loadReview = new Review({
//   'product_id': 1234,
//   'page': 1,
//   'count': 5,
//   'results': [
//     {
//     'review': 'This is a test review',
//     'summary': 'I hope this works',
//     'recommend': true,
//     'response': null,
//     'body': 'Hello everyone',
//     'date': new Date(1609522845466),
//     'reviewer_name': 'Tim',
//     'helpfulness': 13,
//     'photos': [
//       {
//       'id': 123,
//       'url': 'photoUrl'
//       }
//   ]
//   }
// ]
// })

// loadReview.save();


// fs.createReadStream('../Data/characteristic_reviews.csv')
//   .pipe(csv())
//   .on('data', (data) => results.push(data))
//   .on('end', () => {
//     console.log(results);
//   });