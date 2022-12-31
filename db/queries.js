let reviews = `SELECT
reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date / 1000)::date AS date, reviews.reviewer_name, reviews.helpfulness, json_agg(json_build_object('id', photos.id, 'url', photos.url)) AS photos
FROM reviews
LEFT JOIN photos
ON reviews.review_id = photos.review_id
WHERE reviews.product_id = $1
AND reviews.reported = false
GROUP BY reviews.review_id
ORDER BY $2
LIMIT $3
OFFSET $4;`

let meta = `SELECT json_build_object(
'product_id', (SELECT product_id FROM characteristics WHERE product_id = $1 LIMIT 1),
'ratings', (
WITH ratings AS (select rating, count(rating)
FROM reviews WHERE product_id = $2
GROUP BY rating
ORDER BY rating ASC
)
SELECT json_object_agg(rating, count) FROM ratings),
'recommended', (
SELECT json_build_object(
false, (SELECT count(reviews.recommend)
FROM reviews
WHERE product_id = $3
AND recommend = false),
true, (SELECT count(reviews.recommend)
FROM reviews
WHERE product_id = $4
AND recommend = true)
)
),
'characteristics', (
WITH characteristics AS (SELECT characteristics.name AS name, characteristics.id AS id, SUM(characteristic_reviews.value) / COUNT(*)::decimal AS value
FROM characteristics
LEFT JOIN characteristic_reviews
ON characteristics.id = characteristic_reviews.characteristics_id
WHERE characteristics.product_id = $5
GROUP BY characteristics.id)
SELECT json_object_agg(name, (json_build_object('id', id, 'value', value)))
FROM characteristics
)
) AS metadata;`

let helpful = `UPDATE reviews
SET helpfulness = helpfulness + 1
WHERE review_id = $1
RETURNING helpfulness;`

let report = `UPDATE reviews
SET reported = true
WHERE review_id = $1
RETURNING reported;`

let nextReviewId = `SELECT MAX(review_id) FROM reviews;`

let insertReview = `INSERT INTO
reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`

let nextPhotoId = `SELECT MAX(id) FROM photos;`

let insertPhoto = `INSERT INTO
photos(id, review_id, url)
VALUES
($1, $2, $3);`

exports.reviews = reviews;
exports.meta = meta;
exports.helpful = helpful;
exports.report = report;
exports.nextReviewId = nextReviewId;
exports.insertReview = insertReview;
exports.nextPhotoId = nextPhotoId;
exports.insertPhoto = insertPhoto;