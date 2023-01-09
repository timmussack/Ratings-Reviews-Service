-- GET /reviews/
-- ORDER BY can be date DESC, helpfulness DESC or relevance -> combonation is default
EXPLAIN (ANALYZE, BUFFERS)

SELECT reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date / 1000)::date AS date, reviews.reviewer_name, reviews.helpfulness, json_agg(json_build_object('id', photos.id, 'url', photos.url)) AS photos FROM reviews LEFT JOIN photos ON reviews.review_id = photos.review_id WHERE reviews.product_id = 15 AND reviews.reported = false GROUP BY reviews.review_id ORDER BY reviews.helpfulness DESC, reviews.date DESC;

-- GET /reviews/meta
SELECT json_build_object(
'product_id', (SELECT product_id FROM characteristics WHERE product_id = 20 LIMIT 1),
'ratings', (
  WITH ratings AS (select rating, count(rating)
  FROM reviews WHERE product_id = 20
  GROUP BY rating
  ORDER BY rating ASC
  )
  SELECT json_object_agg(rating, count) FROM ratings),
  'recommended', (
    SELECT json_build_object(
    false, (SELECT count(reviews.recommend) FROM reviews WHERE product_id = 20 AND recommend = false),
    true, (SELECT count(reviews.recommend) FROM reviews WHERE product_id = 20 AND recommend = true)
      )
    ),
  'characteristics', (
    WITH chars AS (SELECT characteristics.name AS name, characteristics.id AS id, SUM(characteristic_reviews.value) / COUNT(*)::decimal AS value FROM characteristics LEFT JOIN characteristic_reviews ON characteristics.id = characteristic_reviews.characteristics_id WHERE characteristics.product_id = 20 GROUP BY characteristics.id) SELECT json_object_agg(name, (json_build_object('id', id, 'value', value))) FROM chars
  )
) AS metaData;

-- POST /reviews
INSERT INTO
  reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
VALUES
  (${id}, ${product_id}, ${rating}, now(), ${summary}, ${body}, ${recommend}, false, ${name}, ${email}, 'null', 0);

INSERT INTO
  reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
VALUES
  (1, 4, 1111111111111, 'This is a test summary 12345', 'This is a test body', true, false, 'TestName', 'TestEmail', 'null', 0)
RETURNING review_id;

-- SELECT statement to get inserted review_id
SELECT MAX(review_id) FROM reviews;

INSERT INTO
  photos(id, review_id, url)
VALUES
  (${id}, ${review_id}, ${photos}) --review_id comes from id generated above

INSERT INTO
  characteristic_reviews(id, characteristics_id, review_id, value)
VALUES
  (${id}, ${characteristics_id}, ${review_id}, ${value})

-- PUT /reviews/:review_id/helpful
UPDATE
  reviews
SET
  helpfulness = helpfulness + 1
WHERE
  review_id = ${review_id
RETURNING helpfulness;

-- PUT /reviews/:review_id/report
UPDATE
  reviews
SET
  reported = true
WHERE
  review_id = ${review_id}
RETURNING reported;
