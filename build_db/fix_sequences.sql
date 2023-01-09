SELECT SETVAL('public."reviews_review_id_seq"', COALESCE(MAX(review_id), 1)) FROM public."reviews";
SELECT SETVAL('public."photos_id_seq"', COALESCE(MAX(id), 1)) FROM public."photos";
SELECT SETVAL('public."characteristic_reviews_id_seq"', COALESCE(MAX(id), 1)) FROM public."characteristic_reviews";