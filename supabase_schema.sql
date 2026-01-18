-- Create a table for products
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric,
  model_url text, -- URL to the .glb/.gltf file in Supabase Storage
  thumbnail_url text
);

-- Set up Storage for 3D models
insert into storage.buckets (id, name, public) values ('models', 'models', true);

-- Policy to allow public read access to models
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'models' );

-- Insert some sample data (User needs to replace URLs with actual model URLs)
insert into products (name, description, price, model_url)
values
  ('Classic Chair', 'A timeless wooden chair design.', 150.00, 'https://example.com/chair.glb'),
  ('Modern Lamp', 'Sleek and energy-efficient lighting.', 85.50, 'https://example.com/lamp.glb');
