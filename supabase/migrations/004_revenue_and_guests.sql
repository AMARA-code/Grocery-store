-- ============================================================
-- Migration 004: Revenue tracking + guest order support
-- Run in Supabase SQL editor after 003_local_payments.sql
-- ============================================================

-- ── 1. New columns on orders ─────────────────────────────────
--
--  payment_verified  → admin ticked "payment received" for advance orders
--  cash_collected    → admin ticked "delivered + cash received" for COD
--  revenue_counted   → set to true when the order contributes to revenue
--                      (derived, but stored so we can query it fast)
--  guest_name / guest_email / guest_phone  → stored at order time so
--    the dashboard can count unique guest buyers even without auth

alter table public.orders
  add column if not exists payment_verified  boolean default false,
  add column if not exists cash_collected    boolean default false,
  add column if not exists revenue_counted   boolean generated always as (
    -- Advance payment: admin verified the bank transfer
    (payment_method = 'advance' and payment_verified = true)
    or
    -- Cash on delivery: admin confirmed delivery + cash received
    (payment_method = 'cod'     and cash_collected  = true)
  ) stored,
  add column if not exists guest_name   text,
  add column if not exists guest_email  text,
  add column if not exists guest_phone  text;

-- ── 2. Admin can update verification flags ───────────────────
-- (orders_update_admin policy already exists from 002_admin_rls.sql)
-- No extra policy needed – the existing one covers all columns.

-- ── 3. Revenue summary view ──────────────────────────────────
create or replace view public.revenue_summary as
select
  -- Total confirmed revenue
  coalesce(sum(total) filter (where revenue_counted = true), 0)          as total_revenue,

  -- Advance payments confirmed
  coalesce(sum(total) filter (
    where payment_method = 'advance' and payment_verified = true), 0)    as advance_revenue,

  -- COD confirmed delivered
  coalesce(sum(total) filter (
    where payment_method = 'cod' and cash_collected = true), 0)          as cod_revenue,

  -- Orders pending admin verification (advance sent but not yet verified)
  count(*) filter (
    where payment_method = 'advance' and payment_verified = false
      and status not in ('cancelled'))                                    as pending_advance_count,

  -- COD orders out for delivery (not yet confirmed received)
  count(*) filter (
    where payment_method = 'cod' and cash_collected = false
      and status not in ('cancelled', 'delivered'))                       as pending_cod_count,

  -- Total orders ever placed
  count(*)                                                                as total_orders,

  -- Unique guest buyers: orders that have a guest_email set (no auth user)
  count(distinct guest_email) filter (where guest_email is not null
    and user_id is null)                                                  as total_guests,

  -- Unique registered customers who placed at least one order
  count(distinct user_id) filter (where user_id is not null)             as total_customers

from public.orders;

-- Allow admins to read the view
grant select on public.revenue_summary to authenticated;

-- ── 4. Helper: store guest info from checkout form ───────────
-- The CheckoutForm should write guest_name / guest_email / guest_phone
-- into the order row when the user is not logged in.
-- (No migration change needed – the columns are added above.)

-- ── 5. Quick reference: how revenue_counted works ────────────
--
--  | payment_method | payment_verified | cash_collected | revenue_counted |
--  |----------------|-----------------|----------------|-----------------|
--  | advance        | false           | –              | FALSE           |
--  | advance        | true            | –              | TRUE  ✓         |
--  | cod            | –               | false          | FALSE           |
--  | cod            | –               | true           | TRUE  ✓         |
--