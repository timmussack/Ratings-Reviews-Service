-- Load data
COPY public.revies FROM '/data/reviews.csv' DELIMITER ',' CSV HEADER;
COPY public.photos FROM '/data/photos.csv' DELIMITER ',' CSV HEADER;
COPY public.characteristics FROM '/data/characteristics.csv' DELIMITER ',' CSV HEADER;
COPY public.characteristic_reviews FROM '/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;