-- ============================================================================
-- BE CONSCIOUS — MIGRATION: 20261108000000_create_products_table.sql
-- Description: Creates persistent products table for verified items, cached
-- lookups, and community user-submitted products with Row Level Security.
-- ============================================================================

create table if not exists public.products (
  id text primary key,
  barcode text not null unique,
  product_name text not null,
  brand text default 'Unbranded',
  category text default 'Packaged Food',
  product_image text,
  ingredients jsonb default '[]'::jsonb,
  nutritional_values jsonb default '{}'::jsonb,
  serving_size text,
  conscious_score integer default 65,
  nova_group integer,
  nutri_grade text,
  summary text,
  data_source text default 'community', -- 'verified_catalog' | 'open_food_facts' | 'community' | 'ocr'
  verification_status text default 'unverified', -- 'verified' | 'unverified' | 'pending'
  submitted_by uuid references auth.users(id) on delete set null,
  last_updated timestamptz default timezone('utc'::text, now()) not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indices for performance
create index if not exists products_barcode_idx on public.products (barcode);
create index if not exists products_status_idx on public.products (verification_status);
create index if not exists products_brand_idx on public.products (brand);

-- Row Level Security (RLS)
alter table public.products enable row level security;

-- 1. Anyone (public, guests, authenticated users) can view products
create policy "Anyone can view products"
  on public.products for select
  using (true);

-- 2. Anyone (including anonymous guests and authenticated users) can insert community submissions
create policy "Anyone can submit community products"
  on public.products for insert
  with check (true);

-- 3. Only product submitter or service role can update unverified products
create policy "Users can update their submitted products"
  on public.products for update
  using (auth.uid() is not null and auth.uid() = submitted_by)
  with check (auth.uid() is not null and auth.uid() = submitted_by);
