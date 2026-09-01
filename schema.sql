-- CHARAN MOBILES DATABASE SCHEMA
-- Run this in Supabase SQL Editor.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  stock integer default 0,
  actual_price numeric,
  offer_price numeric,
  specifications text,
  damage_details text,
  condition text check (condition in ('new','used','refurbished')),
  images jsonb default '[]'::jsonb,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  images jsonb default '[]'::jsonb,
  popup_enabled boolean default false,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  bill_number text unique not null,
  customer_name text,
  customer_phone text not null,
  bill_data jsonb not null default '{}'::jsonb,
  payment_status text default 'unpaid',
  created_at timestamptz default now()
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text not null,
  type text,
  english_message text,
  kannada_message text,
  amount numeric,
  include_qr boolean default false,
  sent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists shop_settings (
  id integer primary key default 1,
  opening_time text default '8:00 AM',
  closing_time text default '8:00 PM',
  holiday text default 'Sunday',
  background_color text default '#080808',
  button_color text default '#f4f4f0',
  accent_color text default '#d4af37',
  animations_enabled boolean default true,
  effects_enabled boolean default true,
  updated_at timestamptz default now()
);

-- Enable RLS. Public users can only read published products/offers.
alter table products enable row level security;
alter table offers enable row level security;
alter table bills enable row level security;
alter table reminders enable row level security;
alter table shop_settings enable row level security;

create policy "public read published products"
on products for select using (published = true);

create policy "public read published offers"
on offers for select using (published = true);

-- Create authenticated-owner policies after creating the owner user
-- and replacing this email with the owner's actual login email.
