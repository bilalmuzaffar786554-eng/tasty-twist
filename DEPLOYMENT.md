# Tasty Twist Vercel Deployment Guide

This project is a Next.js app with a Supabase-powered order system. It still uses localStorage for cart and admin menu draft data.

## 1. Check The Project Locally

Open a terminal in the project folder:

```bash
cd "C:\Users\Muhammad Bilal\Desktop\tasty-twist"
```

Install packages if needed:

```bash
npm install
```

Run the production build check:

```bash
npm run build
```

If the build passes, the project is ready for Vercel.

## 2. Upload The Project To GitHub

Vercel works best when your project is on GitHub.

1. Create a new GitHub repository.
2. Upload or push this project to that repository.
3. Make sure these files are included:
   - `app`
   - `components`
   - `data`
   - `types`
   - `utils`
   - `public`
   - `package.json`
   - `next.config.ts`

## 3. Deploy On Vercel

1. Go to `https://vercel.com`.
2. Sign in with GitHub.
3. Click `Add New...`.
4. Click `Project`.
5. Select the Tasty Twist GitHub repository.
6. Keep the default settings:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: leave empty/default
   - Install Command: `npm install`
7. Click `Deploy`.

## 4. Add Environment Variables On Vercel

Before the production site can read and create orders/products, add these Vercel environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

In Vercel:

1. Open your project.
2. Go to `Settings`.
3. Go to `Environment Variables`.
4. Add both variables.
5. Redeploy the project.

## 5. Create The Products Table

The admin menu and public menu share the Supabase `public.products` table.

In Supabase:

1. Open your Supabase project.
2. Go to `SQL Editor`.
3. Open this project file:
   - `SUPABASE_PRODUCTS_TABLE.sql`
4. Copy the SQL into Supabase.
5. Click `Run`.

After this, products added from `/admin/menu` will also appear on `/menu`.

## 6. After Deployment

Open your Vercel website URL and test:

- Home page: `/`
- Menu page: `/menu`
- Checkout page: `/checkout`
- Orders page: `/orders`
- Admin dashboard: `/admin`
- Admin orders: `/admin/orders`
- Admin menu: `/admin/menu`

## Important Note About Data

Orders are saved in the existing Supabase `public.orders` table.
Products are saved in the Supabase `public.products` table.

Cart items are still saved in browser localStorage. That means:

- Cart data stays in the same browser.
- Cart data does not sync between different users or devices.
- Cart data can disappear if browser storage is cleared.

That is expected for this current version.
