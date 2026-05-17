-- FreshCart full database setup. Run entire file in Supabase SQL Editor.

-- STEP 1: TABLES

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'customer' not null,
  full_name text,
  created_at timestamptz default now() not null
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  category text,
  description text,
  image_url text,
  badge text,
  stock int default 100,
  created_at timestamptz default now() not null
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  status text default 'pending',
  total numeric,
  stripe_session_id text,
  payment_method text,
  payment_provider text,
  transaction_id text,
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  items_summary text,
  created_at timestamptz default now() not null
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  product_name text,
  quantity int,
  price numeric
);

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

-- STEP 2: ROW LEVEL SECURITY

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "products_select_public" on public.products;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "order_items_select_own" on public.order_items;
drop policy if exists "order_items_insert_own" on public.order_items;
drop policy if exists "products_insert_admin" on public.products;
drop policy if exists "products_update_admin" on public.products;
drop policy if exists "products_delete_admin" on public.products;
drop policy if exists "orders_select_admin" on public.orders;
drop policy if exists "orders_update_admin" on public.orders;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "order_items_select_admin" on public.order_items;

create policy "profiles_select_own"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id and role = 'customer');

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "products_select_public"
  on public.products for select using (true);

create policy "orders_select_own"
  on public.orders for select using (auth.uid() = user_id);

create policy "orders_insert_own"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "order_items_select_own"
  on public.order_items for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own"
  on public.order_items for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- STEP 3: ADMIN

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "products_insert_admin"
  on public.products for insert with check (public.is_admin());

create policy "products_update_admin"
  on public.products for update using (public.is_admin());

create policy "products_delete_admin"
  on public.products for delete using (public.is_admin());

create policy "orders_select_admin"
  on public.orders for select using (public.is_admin());

create policy "orders_update_admin"
  on public.orders for update using (public.is_admin());

create policy "profiles_select_admin"
  on public.profiles for select using (public.is_admin());

create policy "order_items_select_admin"
  on public.order_items for select using (public.is_admin());

-- STEP 4: AUTO PROFILE ON SIGNUP

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    'customer'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- STEP 5: STORAGE FOR PRODUCT IMAGES

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;

create policy "product_images_public_read"
  on storage.objects for select using (bucket_id = 'product-images');

create policy "product_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- STEP 6: SAMPLE PRODUCTS (optional)

insert into public.products (name, price, category, description, image_url, badge, stock)
select * from (values
  ('Gala Apples (1kg)', 3.49::numeric, 'Fruits & Vegetables', 'Crisp sweet Gala apples.', '/apple-gala-1kg.jpg', 'Fresh', 100),
  ('Baby Spinach (Bag)', 2.99::numeric, 'Fruits & Vegetables', 'Washed baby spinach.', '/spinach-bag.jpg', 'Organic', 80),
  ('Whole Milk (1L)', 2.49::numeric, 'Dairy & Eggs', 'Fresh whole milk.', '/whole-milk.jpg', null::text, 120)
) as v(name, price, category, description, image_url, badge, stock)
where not exists (select 1 from public.products limit 1);
