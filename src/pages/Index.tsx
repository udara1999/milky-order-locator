
import React, { useState, useEffect } from 'react';
import { MapPin, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';
import OrderSummary from '@/components/OrderSummary';
import LocationCapture from '@/components/LocationCapture';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database';

const Index = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Fetched products:', data);
        setProducts(data || []);
        
        // Initialize orders state
        const initialOrders: Record<string, number> = {};
        data?.forEach(product => {
          initialOrders[product.id] = 0;
        });
        setOrders(initialOrders);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    console.log('Quantity change:', productId, quantity);
    setOrders(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const handleSubmitOrder = async (discount: number) => {
    console.log('Starting order submission...');
    const totalItems = Object.values(orders).reduce((sum, qty) => sum + qty, 0);
    
    if (totalItems === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one product",
        variant: "destructive"
      });
      return;
    }

    if (!location) {
      toast({
        title: "Location required",
        description: "Please capture the shop location",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Calculate subtotal amount
      const subtotalAmount = Object.entries(orders).reduce((sum, [productId, quantity]) => {
        if (quantity > 0) {
          const product = products.find(p => p.id === productId);
          return sum + (product ? product.price * quantity : 0);
        }
        return sum;
      }, 0);

      const totalAmount = Math.max(0, subtotalAmount - discount);

      console.log('Order data:', {
        location,
        totalAmount,
        totalItems,
        discount,
        subtotalAmount
      });

      // Insert main order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          shop_location_lat: location.lat,
          shop_location_lng: location.lng,
          shop_location_address: location.address,
          total_amount: totalAmount,
          total_quantity: totalItems,
          discount_amount: discount
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order insertion error:', orderError);
        throw orderError;
      }

      if (!orderData) {
        throw new Error('Failed to create order - no data returned');
      }

      console.log('Order created successfully:', orderData);

      // Prepare order details
      const orderDetails = Object.entries(orders)
        .filter(([_, quantity]) => quantity > 0)
        .map(([productId, quantity]) => {
          const product = products.find(p => p.id === productId);
          if (!product) {
            throw new Error(`Product not found: ${productId}`);
          }
          return {
            order_id: orderData.id,
            product_id: productId,
            quantity,
            unit_price: product.price,
            subtotal: product.price * quantity
          };
        });

      console.log('Order details to insert:', orderDetails);

      // Insert order details
      const { error: detailsError } = await supabase
        .from('order_details')
        .insert(orderDetails);

      if (detailsError) {
        console.error('Order details insertion error:', detailsError);
        throw detailsError;
      }

      console.log('Order details inserted successfully');

      toast({
        title: "Order submitted successfully!",
        description: `Order with ${totalItems} items has been recorded${discount > 0 ? ` with Rs.${discount} discount` : ''}`,
      });

      // Reset form
      setLocation(null);
      const resetOrders: Record<string, number> = {};
      products.forEach(product => {
        resetOrders[product.id] = 0;
      });
      setOrders(resetOrders);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error submitting order",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Order Collection</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Location & Products */}
          <div className="space-y-6">
            {/* Location Capture */}
            <LocationCapture location={location} onLocationChange={setLocation} />

            {/* Products */}
            <CardContent className="p-0 border-0 bg-transparent">
              <div className="grid gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                          id: product.id,
                          name: product.name,
                          description: product.description || '',
                          price: product.price,
                          color: product.color_class || 'bg-gray-50 border-gray-200'
                        }}
                        quantity={orders[product.id] || 0}
                        onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
                    />
                ))}
              </div>
            </CardContent>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              orders={orders}
              products={products.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price
              }))}
              shopName=""
              location={location}
              onSubmit={handleSubmitOrder}
              submitting={submitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
