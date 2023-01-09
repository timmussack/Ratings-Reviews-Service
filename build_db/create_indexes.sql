CREATE INDEX product_id_index ON public.reviews USING btree (product_id);
CREATE INDEX photos_review_id_index ON public.photos USING btree (review_id);
CREATE INDEX characteristics_index ON public.characteristics USING btree (product_id);
CREATE INDEX characteristic_reviews_index ON public.characteristic_reviews USING btree (characteristics_id);