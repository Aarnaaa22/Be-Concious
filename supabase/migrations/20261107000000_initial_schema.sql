-- ==============================================================================
-- BE CONSCIOUS — INITIAL SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create PROFILES Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create SCAN_HISTORY Table
create table if not exists public.scan_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  barcode text not null,
  product_name text,
  brand text,
  product_image text,
  product_data jsonb default '{}'::jsonb not null,
  scanned_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create SAVED_PRODUCTS Table
create table if not exists public.saved_products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  barcode text not null,
  product_data jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_saved_barcode unique (user_id, barcode)
);

-- 4. Create USER_PREFERENCES Table
create table if not exists public.user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  dietary_preferences jsonb default '[]'::jsonb not null,
  allergen_preferences jsonb default '[]'::jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================
create index if not exists idx_scan_history_user_id on public.scan_history (user_id);
create index if not exists idx_scan_history_barcode on public.scan_history (barcode);
create index if not exists idx_scan_history_scanned_at on public.scan_history (scanned_at desc);

create index if not exists idx_saved_products_user_id on public.saved_products (user_id);
create index if not exists idx_saved_products_barcode on public.saved_products (barcode);

create index if not exists idx_user_preferences_user_id on public.user_preferences (user_id);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.scan_history enable row level security;
alter table public.saved_products enable row level security;
alter table public.user_preferences enable row level security;

-- PROFILES POLICIES
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can delete their own profile" on public.profiles;
create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- SCAN_HISTORY POLICIES
drop policy if exists "Users can view their own scan history" on public.scan_history;
create policy "Users can view their own scan history"
  on public.scan_history for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own scan records" on public.scan_history;
create policy "Users can insert their own scan records"
  on public.scan_history for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own scan records" on public.scan_history;
create policy "Users can update their own scan records"
  on public.scan_history for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own scan records" on public.scan_history;
create policy "Users can delete their own scan records"
  on public.scan_history for delete
  using (auth.uid() = user_id);

-- SAVED_PRODUCTS POLICIES
drop policy if exists "Users can view their own saved products" on public.saved_products;
create policy "Users can view their own saved products"
  on public.saved_products for select
  using (auth.uid() = user_id);

drop policy if exists "Users can save their own products" on public.saved_products;
create policy "Users can save their own products"
  on public.saved_products for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own saved products" on public.saved_products;
create policy "Users can update their own saved products"
  on public.saved_products for update
  using (auth.uid() = user_id);

drop policy if exists "Users can remove their own saved products" on public.saved_products;
create policy "Users can remove their own saved products"
  on public.saved_products for delete
  using (auth.uid() = user_id);

-- USER_PREFERENCES POLICIES
drop policy if exists "Users can view their own preferences" on public.user_preferences;
create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own preferences" on public.user_preferences;
create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own preferences" on public.user_preferences;
create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- ==============================================================================
-- 7. AUTOMATED PROFILE & PREFERENCE INITIALIZATION TRIGGER
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    now(),
    now()
  ) on conflict (id) do nothing;
  
  insert into public.user_preferences (user_id, dietary_preferences, allergen_preferences, updated_at)
  values (new.id, '[]'::jsonb, '[]'::jsonb, now())
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users after insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger to update updated_at timestamp automatically
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists update_preferences_updated_at on public.user_preferences;
create trigger update_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.handle_updated_at();
