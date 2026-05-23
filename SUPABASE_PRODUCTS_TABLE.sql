-- Run this once in Supabase SQL Editor.
-- It creates the shared products table used by /menu and /admin/menu.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(10, 2) not null,
  image text not null,
  description text not null,
  details text,
  ingredients jsonb not null default '[]'::jsonb,
  badges jsonb not null default '[]'::jsonb,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
drop policy if exists "Products can be created from frontend" on public.products;
drop policy if exists "Products can be updated from frontend" on public.products;
drop policy if exists "Products can be deleted from frontend" on public.products;

create policy "Products are publicly readable"
on public.products
for select
using (true);

create policy "Products can be created from frontend"
on public.products
for insert
with check (true);

create policy "Products can be updated from frontend"
on public.products
for update
using (true)
with check (true);

create policy "Products can be deleted from frontend"
on public.products
for delete
using (true);
