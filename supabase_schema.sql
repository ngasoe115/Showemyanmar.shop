-- ================================================================
-- SHOWEMYANMAR.SHOP - SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- Copy and paste this script into your Supabase project's SQL Editor
-- ================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
  store_name TEXT,
  city TEXT NOT NULL DEFAULT 'Yangon',
  avatar_url TEXT,
  rating NUMERIC DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 3. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  seller_city TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INT NOT NULL DEFAULT 10,
  is_sold_out BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 1,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
  ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sellers can insert products" ON public.products;
CREATE POLICY "Sellers can insert products" 
  ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Sellers can update products" ON public.products;
CREATE POLICY "Sellers can update products" 
  ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Sellers can delete products" ON public.products;
CREATE POLICY "Sellers can delete products" 
  ON public.products FOR DELETE USING (true);


-- 4. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_address TEXT NOT NULL,
  buyer_city TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'Paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Orders viewable by everyone" ON public.orders;
CREATE POLICY "Orders viewable by everyone" 
  ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Buyers can insert orders" ON public.orders;
CREATE POLICY "Buyers can insert orders" 
  ON public.orders FOR INSERT WITH CHECK (true);


-- 5. CREATE ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INT NOT NULL,
  image_url TEXT,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_name TEXT NOT NULL,
  seller_city TEXT NOT NULL,
  status TEXT CHECK (status IN ('Processing', 'Shipped', 'Delivered')) DEFAULT 'Processing',
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Order items viewable by everyone" ON public.order_items;
CREATE POLICY "Order items viewable by everyone" 
  ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insert order items" ON public.order_items;
CREATE POLICY "Insert order items" 
  ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Update order items" ON public.order_items;
CREATE POLICY "Update order items" 
  ON public.order_items FOR UPDATE USING (true);


-- 6. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, store_name, city, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'buyer'),
    new.raw_user_meta_data->>'store_name',
    COALESCE(new.raw_user_meta_data->>'city', 'Yangon'),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id::text
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
