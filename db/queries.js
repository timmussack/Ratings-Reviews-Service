let reviews = `SELECT reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date / 1000)::date AS date, reviews.reviewer_name, reviews.helpfulness, json_agg(json_build_object('id', photos.id, 'url', photos.url)) AS photos FROM reviews LEFT JOIN photos ON reviews.review_id = photos.review_id WHERE reviews.product_id = $1 AND reviews.reported = false GROUP BY reviews.review_id ORDER BY $2 LIMIT $3 OFFSET $4;`

let metaRating = `SELECT json_build_object('1', count(rating)) AS rating FROM reviews WHERE product_id = $1 AND rating = 1 UNION ALL SELECT json_build_object('2', count(rating)) FROM reviews WHERE product_id = $2 AND rating = 2 UNION ALL SELECT json_build_object('3', count(rating)) FROM reviews WHERE product_id = $3 AND rating = 3 UNION ALL SELECT json_build_object('4', count(rating)) FROM reviews WHERE product_id = $4 AND rating = 4 UNION ALL SELECT json_build_object('5', count(rating)) FROM reviews WHERE product_id = $5 AND rating = 5;`

let metaRecommend = `SELECT count(nullif(recommend, false)) AS false, count(nullif(recommend, true)) AS true FROM reviews WHERE reviews.product_id = $1;`

let metaChars = `SELECT characteristics.name, characteristics.id, SUM(characteristic_reviews.value) / COUNT(*)::decimal AS value FROM characteristics LEFT JOIN characteristic_reviews ON characteristics.id = characteristic_reviews.characteristics_id WHERE characteristics.product_id = $1 GROUP BY characteristics.id`

let helpful = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1;`

let report = `UPDATE reviews SET reported = true WHERE review_id = $1;`

exports.reviews = reviews;
exports.metaRating = metaRating;
exports.metaRecommend = metaRecommend;
exports.getMetaChars = metaChars;
exports.helpful = helpful;
exports.report = report;
