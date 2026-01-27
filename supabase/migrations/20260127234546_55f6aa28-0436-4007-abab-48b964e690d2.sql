-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('sketchbooks', 'sketches', 'crafts', 'gifts', 'other');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'completed', 'cancelled');

-- Site settings table (single row for site configuration)
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_image_url TEXT,
    logo_url TEXT,
    artist_name TEXT DEFAULT 'Artist Name',
    tagline TEXT DEFAULT 'Creating beauty from imagination',
    bio TEXT DEFAULT 'Welcome to my creative space.',
    about_text TEXT,
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Portfolio items table
CREATE TABLE public.portfolio_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category product_category NOT NULL DEFAULT 'other',
    is_available BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_contact TEXT NOT NULL,
    message TEXT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2),
    status order_status DEFAULT 'pending',
    telegram_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view the site)
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view visible portfolio items" 
ON public.portfolio_items FOR SELECT 
USING (is_visible = true);

CREATE POLICY "Anyone can view available products" 
ON public.products FOR SELECT 
USING (is_available = true);

-- Public insert for orders (anyone can place an order)
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Admin policies (authenticated users can manage everything)
CREATE POLICY "Authenticated users can manage site settings" 
ON public.site_settings FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage portfolio items" 
ON public.portfolio_items FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage products" 
ON public.products FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders" 
ON public.orders FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update orders" 
ON public.orders FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (artist_name, tagline, bio, about_text)
VALUES (
    'Artist Name',
    'Creating beauty from imagination',
    'Welcome to my creative space where art meets passion.',
    'I am a passionate artist dedicated to creating unique handmade pieces. Each creation tells a story and is crafted with love and attention to detail.'
);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Storage policies for public read access
CREATE POLICY "Public read access for portfolio" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio');

CREATE POLICY "Public read access for products" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Public read access for site assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-assets');

-- Storage policies for authenticated upload
CREATE POLICY "Authenticated users can upload to portfolio" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload to products" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload to site assets" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'site-assets');

-- Storage policies for authenticated delete
CREATE POLICY "Authenticated users can delete from portfolio" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can delete from products" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can delete from site assets" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'site-assets');