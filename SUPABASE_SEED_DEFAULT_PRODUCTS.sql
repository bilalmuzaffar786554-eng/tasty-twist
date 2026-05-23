-- Run this in Supabase SQL Editor after SUPABASE_PRODUCTS_TABLE.sql.
-- It safely inserts the 8 original Tasty Twist products.
-- You can run it more than once. It will not duplicate products because it upserts by name.

alter table public.products
add constraint if not exists products_name_key unique (name);

alter table public.products
add column if not exists rating numeric(2, 1),
add column if not exists prep_time text,
add column if not exists calories integer;

insert into public.products (
  name,
  category,
  price,
  image,
  description,
  details,
  ingredients,
  badges,
  available,
  rating,
  prep_time,
  calories
)
values
(
  'Zinger Burger',
  'Burgers',
  8.99,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  'Crispy chicken, spicy mayo, lettuce, and toasted brioche.',
  'A crunchy chicken fillet stacked with cool lettuce, tangy pickles, creamy spicy mayo, and a toasted brioche bun.',
  '["Crispy chicken", "Spicy mayo", "Lettuce", "Pickles", "Brioche bun"]'::jsonb,
  '["Popular", "Spicy", "Best Seller"]'::jsonb,
  true,
  4.9,
  '10-15 min',
  620
),
(
  'Smash Burger',
  'Burgers',
  9.99,
  'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80',
  'Double beef patty, cheddar, pickles, onions, and house sauce.',
  'Two seared beef patties with melted cheddar, grilled onions, crisp pickles, and Tasty Twist house sauce.',
  '["Beef patties", "Cheddar", "Pickles", "Onions", "House sauce"]'::jsonb,
  '["Popular"]'::jsonb,
  true,
  4.8,
  '12-16 min',
  710
),
(
  'Pepperoni Pizza',
  'Pizza',
  13.99,
  'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80',
  'Stone-baked crust, mozzarella, pepperoni, and rich tomato sauce.',
  'A golden crust pizza topped with rich tomato sauce, stretchy mozzarella, and crisp pepperoni slices.',
  '["Pepperoni", "Mozzarella", "Tomato sauce", "Stone-baked crust"]'::jsonb,
  '["Popular", "Spicy", "Best Seller"]'::jsonb,
  true,
  4.8,
  '15-20 min',
  880
),
(
  'Margherita Pizza',
  'Pizza',
  11.49,
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
  'Fresh mozzarella, basil, olive oil, and slow-cooked tomato base.',
  'A simple classic with fresh mozzarella, basil, olive oil, and slow-cooked tomato sauce on a crisp base.',
  '["Fresh mozzarella", "Basil", "Olive oil", "Tomato base"]'::jsonb,
  '["New"]'::jsonb,
  true,
  4.6,
  '14-18 min',
  740
),
(
  'Chicken Cheese Steak',
  'Cheese Steaks',
  10.99,
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
  'Juicy chicken, melted cheese, peppers, onions, and soft roll.',
  'Tender chicken strips layered with peppers, onions, and melted cheese inside a warm toasted roll.',
  '["Chicken strips", "Melted cheese", "Peppers", "Onions", "Soft roll"]'::jsonb,
  '["Popular"]'::jsonb,
  true,
  4.7,
  '12-15 min',
  690
),
(
  'Loaded Fries',
  'Fries',
  6.49,
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
  'Golden fries topped with cheese sauce, chicken bites, and herbs.',
  'Crispy fries finished with warm cheese sauce, juicy chicken bites, herbs, and a drizzle of house sauce.',
  '["Golden fries", "Cheese sauce", "Chicken bites", "Herbs"]'::jsonb,
  '["Popular", "New", "Best Seller"]'::jsonb,
  true,
  4.9,
  '8-12 min',
  540
),
(
  'Classic Fries',
  'Fries',
  3.99,
  'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80',
  'Crispy salted fries served hot with signature dipping sauce.',
  'Thin, crispy, golden fries tossed with sea salt and served with a creamy Tasty Twist dipping sauce.',
  '["Potatoes", "Sea salt", "Signature dipping sauce"]'::jsonb,
  '[]'::jsonb,
  true,
  4.5,
  '6-9 min',
  390
),
(
  'Cold Coffee',
  'Drinks',
  4.99,
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
  'Chilled coffee blended smooth with cream and a sweet finish.',
  'Cold coffee blended with milk, cream, and ice for a smooth drink that balances sweetness and roast.',
  '["Cold coffee", "Milk", "Cream", "Ice"]'::jsonb,
  '["New"]'::jsonb,
  true,
  4.6,
  '5-8 min',
  260
)
on conflict (name) do update set
  category = excluded.category,
  price = excluded.price,
  image = excluded.image,
  description = excluded.description,
  details = excluded.details,
  ingredients = excluded.ingredients,
  badges = excluded.badges,
  available = excluded.available,
  rating = excluded.rating,
  prep_time = excluded.prep_time,
  calories = excluded.calories;
