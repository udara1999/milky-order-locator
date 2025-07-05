
-- Drop existing orders table to recreate with proper structure
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  color_class TEXT, -- for UI styling
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the three milk products
INSERT INTO public.products (name, description, price, color_class) VALUES
  ('Regular Milk', 'Fresh daily milk packets', 25.00, 'bg-blue-50 border-blue-200'),
  ('Chocolate Milk', 'Rich chocolate flavored milk', 30.00, 'bg-amber-50 border-amber-200'),
  ('Falouda Milk', 'Traditional falouda flavored milk', 35.00, 'bg-pink-50 border-pink-200');

-- Create orders table (main order information)
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_location_lat DECIMAL(10, 8) NOT NULL,
  shop_location_lng DECIMAL(11, 8) NOT NULL,
  shop_location_address TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  total_quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_details table (individual product quantities per order)
CREATE TABLE public.order_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_details ENABLE ROW LEVEL SECURITY;

-- Products policies (public read access for sales persons)
CREATE POLICY "Anyone can view active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

-- Only admins can manage products
CREATE POLICY "Only admins can manage products" 
  ON public.products 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Anyone can create orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only admins can view orders" 
  ON public.orders 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Order details policies
CREATE POLICY "Anyone can create order details" 
  ON public.order_details 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only admins can view order details" 
  ON public.order_details 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_order_details_order_id ON public.order_details(order_id);
CREATE INDEX idx_order_details_product_id ON public.order_details(product_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
