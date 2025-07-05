
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, MapPin, Percent } from 'lucide-react';
import {formatWithCommas} from "@/hooks/use-mobile.tsx";

interface OrderSummaryProps {
  orders: Record<string, number>;
  products: Array<{ id: string; name: string; price: number }>;
  shopName: string;
  location: { lat: number; lng: number; address: string } | null;
  onSubmit: (discount: number) => void;
  submitting?: boolean;
}

const OrderSummary = ({ orders, products, location, onSubmit, submitting = false }: OrderSummaryProps) => {
  const [discount, setDiscount] = useState(0);
  
  const orderItems = products.filter(product => (orders[product.id] || 0) > 0);
  const totalQuantity = Object.values(orders).reduce((sum, qty) => sum + qty, 0);
  const subtotalAmount = orderItems.reduce((sum, product) => {
    const quantity = orders[product.id] || 0;
    return sum + (quantity * product.price);
  }, 0);
  
  const totalAmount = Math.max(0, subtotalAmount - discount);

  const handleSubmit = () => {
    onSubmit(discount);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {location && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location captured
            </p>
            <p className="text-xs text-gray-500 mt-1">{location.address}</p>
          </div>
        )}

        {orderItems.length > 0 ? (
          <div className="space-y-3">
            {orderItems.map((product) => {
              const quantity = orders[product.id] || 0;
              const itemTotal = quantity * product.price;
              return (
                <div key={product.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{quantity} packets × Rs.{formatWithCommas(product.price)}</p>
                  </div>
                  <p className="font-medium">Rs. {formatWithCommas(itemTotal)}</p>
                </div>
              );
            })}
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Subtotal ({totalQuantity} packets)</span>
              <span className="font-medium">Rs. {formatWithCommas(subtotalAmount)}</span>
            </div>

            {/* Discount Section */}
            <div className="space-y-2">
              <Label htmlFor="discount" className="flex items-center gap-1 text-sm font-medium">
                <Percent className="h-3 w-3" />
                Discount Amount (Rs.)
              </Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                min="0"
                max={subtotalAmount}
                className="text-center"
              />
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center text-red-600">
                <span>Discount</span>
                <span>- Rs. {formatWithCommas(discount)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>Rs. {formatWithCommas(totalAmount)}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No items selected</p>
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          disabled={totalQuantity === 0 || !location || submitting}
        >
          {submitting ? "Submitting..." : "Submit Order"}
        </Button>

        {(!location || totalQuantity === 0) && (
          <div className="text-sm text-gray-500 space-y-1">
            {!location && <p>• Location capture required</p>}
            {totalQuantity === 0 && <p>• Select at least one product</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
