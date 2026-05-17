-- Local payments: COD + JazzCash / EasyPaisa (no Stripe)

alter table public.orders
  add column if not exists payment_method text,
  add column if not exists payment_provider text,
  add column if not exists transaction_id text,
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_phone text,
  add column if not exists shipping_address text,
  add column if not exists items_summary text;

alter table public.order_items
  add column if not exists product_name text;

-- Make yourself admin (run once after signup):
-- update public.profiles set role = 'admin' where email = 'amaranaeem453@gmail.com';
