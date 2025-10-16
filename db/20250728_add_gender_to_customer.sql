-- Thêm cột gender vào bảng customer
ALTER TABLE IF EXISTS public.customer
ADD COLUMN gender varchar(10);
ALTER TABLE customer ADD COLUMN height INT;
ALTER TABLE customer ADD COLUMN weight INT;
