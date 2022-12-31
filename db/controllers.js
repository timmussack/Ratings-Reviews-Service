const { reviews, meta, helpful, report, nextReviewId, insertReview, nextPhotoId, insertPhoto } = require('./queries.js');
const db = require('./index.js');

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
  let { page, count, sort, product_id } = testObj; //req.query
  page = page ? page : 0;
  count = count ? count : 5;
  let order = sort === 'newest' ? 'reviews.helpfulness DESC' : sort === 'helpful' ? 'reviews.date DESC' : 'reviews.helpfulness DESC, reviews.date DESC'

  let text = reviews
  let values = [product_id, sort, count, page];

  try {
      const { rows } = await db.query(text, values);
      const data = {
        'product': product_id,
        'page': page,
        'count': count,
        'results': rows
      };
      //return res.status(200).send(data);
      console.log(JSON.stringify(data));
  } catch (err) {
      //return res.send({ error: err });
      console.log(err.stack, 'Error in getReviews controller function.')
  } finally {
    //client.release()
  }
};

const getMeta = async (req, res) => {
  let { product_id } = testObj; //req.query
  let text = meta;
  let values = [product_id, product_id, product_id, product_id, product_id];

  try {
      const { rows } = await db.query(text, values);
      //return res.status(200).send(rows[0]['metadata']);
      console.log(rows[0]['metadata'])
  } catch (err) {
      //return res.send({ error: err });
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {
    //client.release()
  }
};

const putHelpful = async (req, res) => {
  let { review_id } = testObj; //req.params
  let text = helpful;
  let values = [review_id];

  try {
      const { rows } = await db.query(text, values);
      //return res.status(200).send(rows[0]['metadata']);
      console.log(JSON.stringify(rows))
  } catch (err) {
      //return res.send({ error: err });
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {
    //client.release()
  }
};

const putReport = async (req, res) => {
  let { review_id } = testObj; //req.params
  let text = report;
  let values = [review_id];

  try {
      const { rows } = await db.query(text, values);
      //return res.status(200).send(rows[0]['metadata']);
      console.log(JSON.stringify(rows))
  } catch (err) {
      //return res.send({ error: err });
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {
    //client.release()
  }
};

const postReview = (async (req, res) => {
  let { product_id, body, rating, recommend, name, summary, email, photos, characteristics } = testReviewObj //req.body;
  let reviewDate = Date.now();

  try {
      //Get next review id
      const client1 = await db.query(nextReviewId);
      let next_review_id = client1.rows[0]['max'] + 1;

      //Insert the review into review table
      let valuesInsertReview = [next_review_id, product_id, rating, reviewDate, summary, body, recommend, false, name, email, 'null', 0];
      const client2 = await db.query(insertReview, valuesInsertReview);

      //Check if review has any photo urls to save
      if (photos.length > 0) {
        //Get last photo id
        const client3 = await db.query(nextPhotoId)
        let last_photo_id = client3.rows[0]['max'];
        //Insert photo urls into photo table
        photos.forEach(async (photo) => {
        last_photo_id++;
        let valuesInsertPhoto = [last_photo_id, next_review_id, photo]
        let client4 = await db.query(insertPhoto, valuesInsertPhoto)
        console.log(client4.rows[0])
        })
      }

      //return res.status(200).send(rows[0]['metadata']);
      //console.log(client2.rows, next_review_id, next_photo_id)
  } catch (err) {
      //return res.send({ error: err });
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {
    //client.release()
  }
})();

