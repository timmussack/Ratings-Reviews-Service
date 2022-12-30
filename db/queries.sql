-- Indexs that are being used
CREATE UNIQUE INDEX reviews_pk ON public.reviews USING btree (review_id);
CREATE INDEX product_id_index ON public.reviews USING btree (product_id);
CREATE UNIQUE INDEX photos_pk ON public.photos USING btree (id);
CREATE INDEX photos_review_id_index ON public.photos USING btree (review_id);
CREATE UNIQUE INDEX characteristics_pk ON public.characteristics USING btree (id);
CREATE INDEX characteristics_index ON public.characteristics USING btree (product_id);
CREATE UNIQUE INDEX characteristic_reviews_pk ON public.characteristic_reviews USING btree (id);
CREATE INDEX characteristic_reviews_index ON public.characteristic_reviews USING btree (characteristics_id);

-- GET /reviews/
-- ORDER BY can be date DESC, helpfulness DESC or relevance -> combonation is default
EXPLAIN (ANALYZE, BUFFERS) SELECT
  json_agg(reviewSearch)
FROM
  (SELECT reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date / 1000)::date AS date, reviews.reviewer_name, reviews.helpfulness, string_agg(photos.id::text, ', ') AS photo_ids, string_agg(photos.url::text, ', ') AS photo_urls FROM reviews LEFT JOIN photos ON reviews.review_id = photos.review_id WHERE reviews.product_id = 3800 GROUP BY reviews.review_id ORDER BY reviews.helpfulness DESC, reviews.date DESC) AS reviewSearch;

-- GET /reviews/meta
-- Adds up values in rating column
SELECT
  json_agg(metaRatings)
FROM
  (SELECT rating, count(*) FROM reviews WHERE product_id = 4200 GROUP BY rating) AS metaRatings;

-- Alternate query, not sure if I'll use
SELECT json_agg(rating) FROM reviews WHERE product_id = 4200;

-- Adds up true/false in recommend column
SELECT
  json_agg(metaRecommend)
FROM
  (SELECT count(nullif(recommend, false)) AS false, count(nullif(recommend, true)) AS true FROM reviews WHERE reviews.product_id = 4200) AS metaRecommend;

-- Alternate query, not sure if I'll use
SELECT json_agg(recommend) FROM reviews WHERE product_id = 4200;

-- Provides characteristic ratings for product
SELECT
 json_agg(metaCharacteristics)
FROM
  (SELECT characteristics.name, characteristics.id, SUM(characteristic_reviews.value) / COUNT(*)::decimal AS value FROM characteristics LEFT JOIN characteristic_reviews ON characteristics.id = characteristic_reviews.characteristics_id WHERE characteristics.product_id = 3800 GROUP BY characteristics.id) AS metaCharacteristics;

-- POST /reviews
INSERT INTO
  reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
VALUES
  (${id}, ${product_id}, ${rating}, now(), ${summary}, ${body}, ${recommend}, false, ${name}, ${email}, 'null', 0);

-- SELECT statement to get inserted review_id
SELECT MAX(review_id) FROM reviews;

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