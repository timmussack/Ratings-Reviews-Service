const { reviews, metaRating, metaRecommend, metaChars, helpful, report } = require('./queries.js');
const db = require('./index.js');

const testObj = {
  page: 1,
  count: 2,
  sort: 'newest',
  product_id: 2
}

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

const getMeta = (async (req, res) => {
  let { product_id } = testObj; //req.query

  let text = metaRating
  let values = [product_id, product_id, product_id, product_id, product_id];

  try {
      const { rows } = await db.query(text, values);
      const data = {'product_id': product_id,
                      'ratings': {
                        '1': rows[0]['rating']['1'],
                        '2': rows[1]['rating']['2'],
                        '3': rows[2]['rating']['3'],
                        '4': rows[3]['rating']['4'],
                        '5': rows[4]['rating']['5']
                      }
                    };
      //return res.status(200).send(data);
      console.log(JSON.stringify(data));
  } catch (err) {
      //return res.send({ error: err });
      console.log(err.stack, 'Error in getMeta controller function.')
  } finally {
    //client.release()
  }
})();

