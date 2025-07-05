
import React, { useState } from 'react';
import { MapPin, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';
import OrderSummary from '@/components/OrderSummary';
import LocationCapture from '@/components/LocationCapture';

const Index = () => {
  const { toast } = useToast();
  const [shopName, setShopName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [orders, setOrders] = useState({
    milk: 0,
    chocolate: 0,
    falouda: 0
  });

  const products = [
    {
      id: 'milk',
      name: 'Regular Milk',
      description: 'Fresh daily milk packets',
      price: 25,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'chocolate',
      name: 'Chocolate Milk',
      description: 'Rich chocolate flavored milk',
      price: 30,
      color: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'falouda',
      name: 'Falouda Milk',
      description: 'Traditional falouda flavored milk',
      price: 35,
      color: 'bg-pink-50 border-pink-200'
    }
  ];

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrders(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const handleSubmitOrder = () => {
    const totalItems = Object.values(orders).reduce((sum, qty) => sum + qty, 0);
    
    if (!shopName.trim()) {
      toast({
        title: "Shop name required",
        description: "Please enter the shop name",
        variant: "destructive"
      });
      return;
    }

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

    // Here you would typically send the order to your backend
    console.log('Order submitted:', {
      shopName,
      contactPerson,
      phoneNumber,
      location,
      orders,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Order submitted successfully!",
      description: `Order for ${shopName} has been recorded`,
    });

    // Reset form
    setShopName('');
    setContactPerson('');
    setPhoneNumber('');
    setLocation(null);
    setOrders({ milk: 0, chocolate: 0, falouda: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Milk Order Collection</h1>
          </div>
          <p className="text-gray-600">Collect orders efficiently for your dairy business</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Shop Details */}
          <div className="space-y-6">
            {/* Shop Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Shop Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    placeholder="Enter shop name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Contact person name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Capture */}
            <LocationCapture location={location} onLocationChange={setLocation} />

            {/* Products */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Select Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={orders[product.id as keyof typeof orders]}
                      onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              orders={orders}
              products={products}
              shopName={shopName}
              location={location}
              onSubmit={handleSubmitOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
