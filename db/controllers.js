const { reviews, meta, helpful, report, insertReview, insertPhoto, insertChars } = require('./queries.js');
const db = require('./index.js');

//Test objects can be used to test controllers locally
const testObj = {
  page: 1,
  count: 2,
  sort: 'newest',
  product_id: 20,
  review_id: 1000
};

const testReviewObj = {
  product_id: 5,
  body: 'This is a test body 12345',
  rating: 4,
  recommend: true,
  name: 'testName',
  summary: 'This is a test summary',
  email: 'testEmail',
  photos: ['url1', 'url2', 'url3'],
  characteristics: {
    14: 5,
    15: 5,
    16: 4,
    17: 2
  }
};

const getReviews = async (req, res) => {
  //let { page, count, sort, product_id } = testObj;
  let { page, count, sort, product_id } = req.query;

  page = page ? page : 0;
  count = count ? count : 5;
  let order = sort === 'newest' ? 'reviews.helpfulness DESC' : sort === 'helpful' ? 'reviews.date DESC' : 'reviews.helpfulness DESC, reviews.date DESC'

  let text = reviews
  let values = [product_id, sort, count, page];

  const client = await db.getClient();

  try {
      const { rows } = await query(text, values);
      const data = {
        'product': product_id,
        'page': page,
        'count': count,
        'results': rows
      };
      return res.status(200).json(data);
      //console.log(JSON.stringify(data));
  } catch (err) {
      console.log(err.stack, 'Error in getReviews controller function.')
      return res.status(408).end();
  } finally {
    release();
  }
};

const getMeta = async (req, res) => {
  //let { product_id } = testObj;
  let { product_id } = req.query;

  let text = meta;
  let values = [product_id, product_id, product_id, product_id, product_id];

  try {
      const { rows } = await db.query(text, values);
      return res.status(200).json(rows[0]['metadata']);
      //console.log(rows[0]['metadata'])
  } catch (err) {
      return res.status(408).end();
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {

  }
};

const putHelpful = async (req, res) => {
  //let { review_id } = testObj;
  let { review_id } = req.params

  let text = helpful;
  let values = [review_id];

  try {
      const { rows } = await db.query(text, values);
      return res.status(204).end('No Content');
      //console.log(JSON.stringify(rows))
  } catch (err) {
      return res.status(408).end();
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {

  }
};

const putReport = async (req, res) => {
  //let { review_id } = testObj;
  let { review_id } = req.params;

  let text = report;
  let values = [review_id];

  try {
      const { rows } = await db.query(text, values);
      return res.status(204).end('No Content');
      //console.log(JSON.stringify(rows))
  } catch (err) {
      return res.status(408).end();
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {

  }
};

//Transactional Review Insert
const postReview = async (req, res) => {
  //console.log('Body', req.body);
  //let { product_id, body, rating, recommend, name, summary, email, photos, characteristics } = testReviewObj;
  let { product_id, body, rating, recommend, name, summary, email, photos, characteristics } = req.body;
  console.log('Posting review to ', product_id);
  let reviewDate = Date.now();

  const client = await db.getClient();

  try {
    await client.query('BEGIN')
    //Insert the review into review table
    let valuesInsertReview = [product_id, rating, reviewDate, summary, body, recommend, false, name, email, 'null', 0];
    const res_review = await client.query(insertReview, valuesInsertReview);
    //console.log("Review Id", res_review.rows[0]['review_id']);
     //Check if review has any photo urls to save
     if (photos.length > 0) {
      //Insert photo urls into photo table
      photos.forEach(async (photo) => {
      let valuesInsertPhoto = [res_review.rows[0]['review_id'], photo];
      let res_photo = await client.query(insertPhoto, valuesInsertPhoto);
      //console.log("Photo Id", res_photo.rows[0]['id']);
      });
    };

    //Insert chars into characteristic_reviews table
    Object.keys(characteristics).forEach(async (key) => {
      let valuesInsertChars = [key, res_review.rows[0]['review_id'], characteristics[key]];
      let res_char = await client.query(insertChars, valuesInsertChars);
      //console.log("Char Id", res_char.rows[0]['id'])
      })

    await client.query('COMMIT');
    return res.status(201).end('Created');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e
  } finally {
    client.release();
  }
};

exports.getReviews = getReviews;
exports.getMeta = getMeta;
exports.putHelpful = putHelpful;
exports.putReport = putReport;
exports.postReview = postReview;
