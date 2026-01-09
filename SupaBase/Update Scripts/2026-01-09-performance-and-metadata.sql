-- Database Performance and Feature Updates
-- Created: 2026-01-09
-- Purpose: Add indexes for performance, support abandoned cart reminders, and enable metadata-driven relations.

-- 1. Performance Indexes
-- Adding indexes to frequently joined foreign keys that were missing or needed.

-- Variant Foreign Keys
CREATE INDEX IF NOT EXISTS idx_variant_product_id ON public.variant(product_id);
CREATE INDEX IF NOT EXISTS idx_variant_status_id ON public.variant(status_id);

-- Cart User Lookups (Critical for session/cart retrieval)
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_variant_id ON public.cart(variant_id);

-- Order Items Lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);

-- Metadata System (Critical for the generic Admin UI)
CREATE INDEX IF NOT EXISTS idx_metadata_entity_id ON public.metadata(entity_id);

-- Payment System
CREATE INDEX IF NOT EXISTS idx_payment_status_id ON public.payment(status_id);

-- Auth / User Lookups (If not already auto-created by primary keys, helpful for joins)
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);


-- 2. Feature: Abandoned Cart Reminders
-- Adding timestamps to track user activity and reminder status to avoid spam.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cart' AND column_name = 'reminder_sent_at') THEN
        ALTER TABLE public.cart ADD COLUMN reminder_sent_at timestamp with time zone;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cart' AND column_name = 'last_active_at') THEN
        ALTER TABLE public.cart ADD COLUMN last_active_at timestamp with time zone DEFAULT now();
    END IF;
END $$;


-- 3. Feature: Metadata Driven Relations
-- Adding a JSONB column to define child/parent relationships dynamically for the Generic UI.
-- Example Format: [{"table": "variant", "fk": "product_id", "label": "Variants", "type": "has_many" }]

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'entity' AND column_name = 'references') THEN
        ALTER TABLE public.entity ADD COLUMN "references" jsonb DEFAULT '[]'::jsonb;
    END IF;
END $$;


-- Note: Aura Images will be handled with static assets in /public folder (e.g. /images/aura-success.png)
-- No database changes required for Aura images.
