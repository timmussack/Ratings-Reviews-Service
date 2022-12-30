-- Create index
-- CREATE INDEX reviews_index ON reviews(review_id, product_id);
-- CREATE INDEX photos_index ON photos(review_id, url, id);
-- CREATE INDEX characteristics_index ON characteristics(product_id, id);
-- CREATE INDEX characteristic_reviews_index ON characteristic_reviews(characteristics_id);

-- GET /reviews/
-- ORDER BY can be date DESC, helpfulness DESC or relevance -> combonation is default
EXPLAIN (ANALYZE, BUFFERS) SELECT
  json_agg(reviewSearch)
FROM
  (SELECT reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date / 1000)::date AS date, reviews.reviewer_name, reviews.helpfulness, string_agg(photos.id::text, ', ') AS photo_ids, string_agg(photos.url::text, ', ') AS photo_urls FROM reviews LEFT JOIN photos ON reviews.review_id = photos.review_id WHERE reviews.product_id = 2 GROUP BY reviews.review_id ORDER BY reviews.helpfulness DESC, reviews.date DESC) AS reviewSearch;

  --ORDER BY reviews.helpfulness DESC, reviews.date DESC

-- GET /reviews/meta
SELECT
  json_agg(metaRatings)
FROM
  (SELECT rating, count(*) FROM reviews WHERE product_id = 40 GROUP BY rating) AS metaRatings;

SELECT
  json_agg(metaRecommend)
FROM
  (SELECT count(nullif(recommend, false)) AS false, count(nullif(recommend, true)) AS true FROM reviews WHERE reviews.product_id = 40) AS metaRecommend;

SELECT
 json_agg(metaCharacteristics)
FROM
  (SELECT characteristics.name, characteristics.id, SUM(characteristic_reviews.value) / COUNT(*)::decimal AS value FROM characteristics LEFT JOIN characteristic_reviews ON characteristics.id = characteristic_reviews.characteristics_id WHERE characteristics.product_id = 40 GROUP BY characteristics.id) AS metaCharacteristics;

  --UNION SELECT reviews.rating, reviews.recommend FROM reviews WHERE reviews.product_id = 40;

-- POST /reviews
INSERT INTO
  reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
VALUES
  (${id}, ${product_id}, ${rating}, now(), ${summary}, ${body}, ${recommend}, false, ${name}, ${email}, 'null', 0);

-- Need SELECT statement to know what the new review id is from INSERT

INSERT INTO --Only saves 1 URL, will have to loop if multiple URLs
  photos(id, review_id, url)
VALUES
  (${id}, ${review_id}, ${photos}) --review_id comes from id generated above

INSERT INTO --Only saves 1, will have to run 4 times per new review, destructure object
  characteristic_reviews(id, characteristics_id, review_id, value)
VALUES
  (${id}, ${characteristics_id}, ${review_id}, ${value})

-- PUT /reviews/:review_id/helpful
UPDATE
  reviews
SET
  helpfulness = helpfulness + 1
WHERE
  review_id = ${review_id};

-- PUT /reviews/:review_id/report
UPDATE
  reviews
SET
  reported = true
WHERE
  review_id = ${review_id};