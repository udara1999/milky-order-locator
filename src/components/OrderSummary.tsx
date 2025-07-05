
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, MapPin } from 'lucide-react';

interface OrderSummaryProps {
  orders: { milk: number; chocolate: number; falouda: number };
  products: Array<{ id: string; name: string; price: number }>;
  shopName: string;
  location: { lat: number; lng: number; address: string } | null;
  onSubmit: () => void;
}

const OrderSummary = ({ orders, products, shopName, location, onSubmit }: OrderSummaryProps) => {
  const orderItems = products.filter(product => orders[product.id as keyof typeof orders] > 0);
  const totalQuantity = Object.values(orders).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = orderItems.reduce((sum, product) => {
    const quantity = orders[product.id as keyof typeof orders];
    return sum + (quantity * product.price);
  }, 0);

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {shopName && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-gray-900">{shopName}</p>
            {location && (
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                Location captured
              </p>
            )}
          </div>
        )}

        {orderItems.length > 0 ? (
          <div className="space-y-3">
            {orderItems.map((product) => {
              const quantity = orders[product.id as keyof typeof orders];
              return (
                <div key={product.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{quantity} packets × ₹{product.price}</p>
                  </div>
                  <p className="font-medium">₹{quantity * product.price}</p>
                </div>
              );
            })}
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total ({totalQuantity} packets)</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No items selected</p>
          </div>
        )}

        <Button 
          onClick={onSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          disabled={totalQuantity === 0 || !shopName.trim() || !location}
        >
          Submit Order
        </Button>

        {(!shopName.trim() || !location || totalQuantity === 0) && (
          <div className="text-sm text-gray-500 space-y-1">
            {!shopName.trim() && <p>• Shop name required</p>}
            {!location && <p>• Location capture required</p>}
            {totalQuantity === 0 && <p>• Select at least one product</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
