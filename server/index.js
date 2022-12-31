const express = require('express');
//const path = require('path');
const compression = require('compression');
require('dotenv').config();
const { getReviews, getMeta, putHelpful, putReport, postReview } = require('../db/controllers.js');
const app = express();

app.use(compression({level: 9}));
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, '../Client/dist')));
app.use(express.json());

//Get reviews, Status: 200 OK
app.get('/reviews', getReviews);

//Get review meta, Status: 200 OK
app.get('/reviews/meta', getMeta);

//Add review to database, Status: 201 CREATED
app.post('/reviews', postReview);

//Mark review as helpful, Status: 204 NO CONTENT
app.put('/reviews/:review_id/helpful', putHelpful);

//Report a review, Status: 204 NO CONTENT
app.put('/reviews/:review_id/report', putReport);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
