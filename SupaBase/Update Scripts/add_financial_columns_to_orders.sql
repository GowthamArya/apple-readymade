
-- Migration to add financial breakdown columns to the orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;
