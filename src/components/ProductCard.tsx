
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {formatWithCommas} from "@/hooks/use-mobile.tsx";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductCard = ({ product, quantity, onQuantityChange }: ProductCardProps) => {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    onQuantityChange(Math.max(0, quantity - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onQuantityChange(Math.max(0, value));
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${product.color}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm font-medium text-blue-600">Rs. {formatWithCommas(product.price)} per packet</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            className="h-8 w-8 p-0 hover:bg-blue-100"
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            className="w-16 h-8 text-center"
            min="0"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            className="h-8 w-8 p-0 hover:bg-blue-100"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
