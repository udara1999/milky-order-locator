
import { createClient } from '@supabase/supabase-js';

// Define our database schema types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          color_class: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          color_class?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          color_class?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          shop_location_lat: number;
          shop_location_lng: number;
          shop_location_address: string | null;
          total_amount: number;
          total_quantity: number;
          discount_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_location_lat: number;
          shop_location_lng: number;
          shop_location_address?: string | null;
          total_amount: number;
          total_quantity: number;
          discount_amount?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          shop_location_lat?: number;
          shop_location_lng?: number;
          shop_location_address?: string | null;
          total_amount?: number;
          total_quantity?: number;
          discount_amount?: number;
          created_at?: string;
        };
      };
      order_details: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

const SUPABASE_URL = "https://bwtddaxpdviymvrjkpaa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dGRkYXhwZHZpeW12cmprcGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTI1MDgsImV4cCI6MjA2NzI2ODUwOH0.b_4qF0o7uF5x_kwy_DGckXmtW88aG6dQHM9jfKgW_Dw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
