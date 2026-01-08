
-- Update orders table to include address_id
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS address_id INTEGER REFERENCES public.address(id);

-- Update order statuses if needed
-- ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
-- ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded', 'ready_to_ship'));

-- Update address table to include state and country if they don't exist
ALTER TABLE public.address
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
