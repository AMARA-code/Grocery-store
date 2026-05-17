/** Product categories used in catalog UI and filters. */
export type Category =
  | "Fruits & Vegetables"
  | "Bakery"
  | "Dairy & Eggs"
  | "Meat & Seafood"
  | "Pantry"
  | "Beverages";

/** Static / seed catalog shape (`image` maps to DB `image_url`). */
export interface SeedProduct {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  badge?: string;
}

export type ProfileRole = "customer" | "admin";

/** Row shape for `public.profiles` (matches migration). */
export interface ProfileRow {
  id: string;
  email: string | null;
  role: string;
  full_name: string | null;
  created_at: string;
}

/** Row shape for `public.products`. */
export interface ProductRow {
  id: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
  image_url: string | null;
  badge: string | null;
  stock: number;
  created_at: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "advance";

export type PaymentProvider = "jazzcash" | "easypaisa";

/** Row shape for `public.orders`. */
export interface OrderRow {
  id: string;
  user_id: string | null;
  status: string;
  total: number | null;
  stripe_session_id: string | null;
  payment_method: PaymentMethod | string | null;
  payment_provider: PaymentProvider | string | null;
  transaction_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  items_summary: string | null;
  created_at: string;
}

/** Row shape for `public.order_items`. */
export interface OrderItemRow {
  id: string;
  order_id: string | null;
  product_id: string | null;
  quantity: number | null;
  price: number | null;
}

/** Admin orders table row with payment & customer details. */
export interface AdminOrderRow {
  id: string;
  status: string;
  total: number | null;
  created_at: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: string | null;
  itemsSummary: string | null;
  paymentMethod: string | null;
  paymentProvider: string | null;
  transactionId: string | null;
}
