
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  color_class: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  shop_location_lat: number;
  shop_location_lng: number;
  shop_location_address: string | null;
  total_amount: number;
  total_quantity: number;
  created_at: string;
}

export interface OrderDetail {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  order_details: Array<OrderDetail & {
    products: {
      name: string;
      description: string | null;
    };
  }>;
}
