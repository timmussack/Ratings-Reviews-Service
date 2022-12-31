const express = require('express');
const path = require('path');
const axios = require('axios');
const compression = require('compression');
require('dotenv').config();
const { getReviews, getMeta, putHelpful, putReport, postReview } = require('../db/controllers.js');

const app = express();
app.use(compression({level: 9}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Client/dist')));
app.use(express.json());

//Get reviews, Status: 200 OK
app.get('/reviews', (req, res) => {
  const { product_id, count, sort, page } = req.query;

});

//Get review meta, Status: 200 OK
app.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;

});

//Add review to database, Status: 201 CREATED
app.post('/reviews', (req, res) => {
  const { product_id, body, rating, recommend, name, summary, email, photos, characteristics } = req.body;

});

//Mark review as helpful, Status: 204 NO CONTENT
app.put('/reviews/:review_id/helpful', (req, res) => {
  const { review_id } = req.body;

});

//Report a review, Status: 204 NO CONTENT
app.put('/reviews/:review_id/report', (req, res) => {
  const { review_id } = req.body;

});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
