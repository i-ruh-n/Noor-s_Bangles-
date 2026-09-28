-- ============================================================================
-- NOOR'S HANDMADE BANGLES - COMPLETE SUPABASE POSTGRES SCHEMA
-- Includes Tables, RLS Security Policies, Storage Buckets, Functions & Sample Data
-- ============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(10,2) CHECK (old_price >= price),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sizes TEXT[] DEFAULT ARRAY['2.4', '2.6', '2.8'],
    colors TEXT[] DEFAULT ARRAY['Red', 'Gold'],
    materials TEXT[] DEFAULT ARRAY['Silk Thread', 'Stone Chain'],
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_area TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bkash', 'nagad')),
    bkash_trx_id TEXT,
    nagad_trx_id TEXT,
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    discount_code TEXT,
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
    tracking_note TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    selected_size TEXT,
    selected_color TEXT,
    total NUMERIC(10,2) NOT NULL
);

-- 6. Discount Codes Table
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Custom Orders Table
CREATE TABLE IF NOT EXISTS public.custom_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    design_description TEXT NOT NULL,
    material TEXT,
    size TEXT,
    reference_image_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Shop Settings Table
CREATE TABLE IF NOT EXISTS public.shop_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin Full Categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Products RLS
CREATE POLICY "Public Read Active Products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admin Full Products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Orders RLS (Public insert only, no public select to protect customer privacy!)
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

-- Order Items RLS
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Order Items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');

-- Discount Codes RLS
CREATE POLICY "Public Read Active Discounts" ON public.discount_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Admin Full Discounts" ON public.discount_codes FOR ALL USING (auth.role() = 'authenticated');

-- Reviews RLS
CREATE POLICY "Public Read Approved Reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');

-- Custom Orders RLS
CREATE POLICY "Public Insert Custom Orders" ON public.custom_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Custom Orders" ON public.custom_orders FOR ALL USING (auth.role() = 'authenticated');

-- Shop Settings RLS
CREATE POLICY "Public Read Settings" ON public.shop_settings FOR SELECT USING (true);
CREATE POLICY "Admin Full Settings" ON public.shop_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- SECURE POSTGRES FUNCTIONS (RPC)
-- ============================================================================

-- Function: Secure Order Tracking (Requires BOTH order_number AND phone)
CREATE OR REPLACE FUNCTION public.track_order(p_order_number TEXT, p_phone TEXT)
RETURNS TABLE (
    id UUID,
    order_number TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    delivery_address TEXT,
    delivery_area TEXT,
    payment_method TEXT,
    total_amount NUMERIC,
    status TEXT,
    tracking_note TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.order_number,
        o.customer_name,
        o.customer_phone,
        o.delivery_address,
        o.delivery_area,
        o.payment_method,
        o.total_amount,
        o.status,
        o.tracking_note,
        o.created_at
    FROM public.orders o
    WHERE UPPER(TRIM(o.order_number)) = UPPER(TRIM(p_order_number))
      AND RIGHT(REGEXP_REPLACE(o.customer_phone, '\D', '', 'g'), 8) = RIGHT(REGEXP_REPLACE(p_phone, '\D', '', 'g'), 8);
END;
$$;

-- Function: Database Rate Limit (Max 3 orders per phone number per hour)
CREATE OR REPLACE FUNCTION public.enforce_order_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    recent_count INT;
BEGIN
    SELECT COUNT(*) INTO recent_count
    FROM public.orders
    WHERE customer_phone = NEW.customer_phone
      AND created_at > (NOW() - INTERVAL '1 hour');

    IF recent_count >= 3 THEN
        RAISE EXCEPTION 'Order limit reached. Maximum 3 orders per phone number per hour.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_order_rate_limit
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.enforce_order_rate_limit();

-- ============================================================================
-- STORAGE BUCKETS SETUP (Run in Supabase Storage SQL editor if needed)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Product Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin Write Product Images" ON storage.objects FOR ALL USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ============================================================================
-- SAMPLE SEED DATA (8 Handmade Bangles + Categories)
-- ============================================================================
INSERT INTO public.categories (id, name, slug, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Silk Thread', 'silk-thread', 1),
('22222222-2222-2222-2222-222222222222', 'Bridal & Kundan', 'bridal-kundan', 2),
('33333333-3333-3333-3333-333333333333', 'Metal & Brass', 'metal-brass', 3),
('44444444-4444-4444-4444-444444444444', 'Glass Churi', 'glass-churi', 4),
('55555555-5555-5555-5555-555555555555', 'Terracotta & Artisan', 'terracotta-artisan', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (id, name, slug, description, category_id, price, old_price, stock, sizes, colors, materials, is_featured, is_new) VALUES
('a1111111-1111-1111-1111-111111111111', 'Reshmi Silk Thread Bangle Set (Maroon & Gold)', 'reshmi-silk-thread-maroon-gold', 'Handcrafted premium silk thread bangles wrapped over high-durability acrylic base. Embellished with stone chain and zardosi work. Ideal for weddings.', '11111111-1111-1111-1111-111111111111', 650, 850, 15, ARRAY['2.4', '2.6', '2.8'], ARRAY['Maroon', 'Gold'], ARRAY['Silk Thread', 'Stone Chain'], true, true),
('a2222222-2222-2222-2222-222222222222', 'Royal Kundan Bridal Chura Set', 'royal-kundan-bridal-chura', 'Luxurious bridal chura set featuring authentic Kundan stones, pearls, and red acrylic bangles. Hand-set by master craftsmen.', '22222222-2222-2222-2222-222222222222', 1850, 2200, 8, ARRAY['2.4', '2.6'], ARRAY['Crimson Red', 'Pearl White'], ARRAY['Kundan', 'Faux Pearl'], true, false),
('a3333333-3333-3333-3333-333333333333', 'Antique Brass Kada Bangle (Pair)', 'antique-brass-kada-pair', 'Vintage finish brass kada with floral embossing and screw opening for perfect fit.', '33333333-3333-3333-3333-333333333333', 950, 1100, 20, ARRAY['2.4', '2.6', '2.8', '2.10'], ARRAY['Antique Gold', 'Bronze'], ARRAY['Brass'], true, false),
('a4444444-4444-4444-4444-444444444444', 'Traditional Glass Reshmi Churi (24 Pcs Combo)', 'traditional-glass-reshmi-churi-24pcs', 'Authentic glass churi set with sparkling glitter finish.', '44444444-4444-4444-4444-444444444444', 380, 450, 30, ARRAY['2.2', '2.4', '2.6'], ARRAY['Emerald Green', 'Royal Blue'], ARRAY['Glass'], false, true),
('a5555555-5555-5555-5555-555555555555', 'Meenakari Floral Hand-Painted Bangle Set', 'meenakari-floral-bangle-set', 'Exquisite Meenakari enamel artwork handcrafted on durable metal core.', '22222222-2222-2222-2222-222222222222', 1200, 1500, 12, ARRAY['2.4', '2.6', '2.8'], ARRAY['Multicolor', 'Turquoise'], ARRAY['Meenakari Enamel'], true, true),
('a6666666-6666-6666-6666-666666666666', 'Terracotta Artisan Hand-Carved Bangle', 'terracotta-artisan-hand-carved-bangle', 'Eco-friendly baked clay bangle painted with natural acrylic colors and sealed with waterproof varnish.', '55555555-5555-5555-5555-555555555555', 550, 700, 10, ARRAY['2.4', '2.6'], ARRAY['Terracotta Orange'], ARRAY['Terracotta Clay'], false, false),
('a7777777-7777-7777-7777-777777777777', 'Velvet Metal Bangle Mix (48 Pcs Box)', 'velvet-metal-bangle-mix-48pcs', 'Soft velvet touch bangles with gold metal spacer bangles. Comfortable for all-day wear.', '11111111-1111-1111-1111-111111111111', 890, 1150, 25, ARRAY['2.4', '2.6', '2.8'], ARRAY['Deep Purple', 'Rose Pink'], ARRAY['Velvet Flocked Metal'], false, true),
('a8888888-8888-8888-8888-888888888888', 'Royal Pearl Studded Kada Set', 'royal-pearl-studded-kada-set', 'Double kada set lined with freshwater-style lustrous imitation pearls and zircon crystal accents.', '22222222-2222-2222-2222-222222222222', 1450, 1750, 5, ARRAY['2.6', '2.8'], ARRAY['Ivory Pearl', 'Gold'], ARRAY['Faux Pearl', 'Brass'], true, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.discount_codes (code, type, value, min_order_amount, usage_limit, is_active) VALUES
('NOOR10', 'percentage', 10, 500, 100, true),
('EID200', 'fixed', 200, 1500, 50, true)
ON CONFLICT (code) DO NOTHING;
