# Tasty Twist Vercel Deployment Guide

This project is a frontend-only Next.js app. It uses localStorage for cart, orders, and admin menu data.

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

## 4. After Deployment

Open your Vercel website URL and test:

- Home page: `/`
- Menu page: `/menu`
- Checkout page: `/checkout`
- Orders page: `/orders`
- Admin dashboard: `/admin`
- Admin orders: `/admin/orders`
- Admin menu: `/admin/menu`

## Important Note About Data

This app does not use a real database yet.

Cart items, orders, and admin menu changes are saved in the browser localStorage. That means:

- Data stays in the same browser.
- Data does not sync between different users or devices.
- Data can disappear if browser storage is cleared.

That is expected for this frontend-only version.
