\COPY public.reviews FROM '../Data/reviews.csv' DELIMITER ',' CSV HEADER;
\COPY public.photos FROM '../Data/reviews_photos.csv' DELIMITER ',' CSV HEADER;
\COPY public.characteristics FROM '../Data/characteristics.csv' DELIMITER ',' CSV HEADER;
\COPY public.characteristic_reviews FROM '../Data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;