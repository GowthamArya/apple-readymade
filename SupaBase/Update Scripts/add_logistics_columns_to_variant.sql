
-- Add logistics columns to variant table
ALTER TABLE public.variant 
ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 0.5, -- in kg
ADD COLUMN IF NOT EXISTS length NUMERIC DEFAULT 10, -- in cm
ADD COLUMN IF NOT EXISTS breadth NUMERIC DEFAULT 10, -- in cm
ADD COLUMN IF NOT EXISTS height NUMERIC DEFAULT 5; -- in cm
