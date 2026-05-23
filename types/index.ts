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

/** Unified Product type — matches Supabase `public.products` row. */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  badge?: string | null;
  stock?: number;
  created_at?: string;
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

  // ── Revenue / verification fields (migration 004) ──────────
  /** Admin ticked "advance payment received" — only relevant for advance orders */
  payment_verified: boolean;
  /** Admin ticked "delivered + cash received" — only relevant for COD orders */
  cash_collected: boolean;
  /**
   * Computed (stored generated column).
   * TRUE when (advance && payment_verified) OR (cod && cash_collected).
   * This is the authoritative flag for whether the order adds to revenue.
   */
  revenue_counted: boolean;

  // ── Guest buyer fields (migration 004) ─────────────────────
  /** Filled at checkout for non-authenticated buyers */
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
}

/** Row shape for `public.order_items`. */
export interface OrderItemRow {
  id: string;
  order_id: string | null;
  product_id: string | null;
  product_name: string | null;
  quantity: number | null;
  price: number | null;
}

/** Admin orders table row — flattened for UI use. */
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

  // verification
  paymentVerified: boolean;
  cashCollected: boolean;
  revenueCounted: boolean;

  // guest info
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
}

/** Shape returned by `public.revenue_summary` view. */
export interface RevenueSummary {
  total_revenue: number;
  advance_revenue: number;
  cod_revenue: number;
  pending_advance_count: number;
  pending_cod_count: number;
  total_orders: number;
  total_guests: number;
  total_customers: number;
}