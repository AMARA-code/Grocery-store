# FreshCart – Grocery E‑commerce

It is a modern **grocery e‑commerce storefront** built with **React, TypeScript, and Vite**. It provides a complete browse → details → cart → checkout → order confirmation flow suitable for real-world online grocery stores.

## Tech stack

- React + TypeScript + Vite
- React Router
- LocalStorage cart persistence
- React Hot Toast for notifications
- Modern responsive CSS (no CSS framework)

## Getting started

```bash
cd grocery-store
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Available scripts

- **`npm run dev`**: Start the Vite dev server
- **`npm run build`**: Build for production
- **`npm run preview`**: Preview the production build locally

## Features

- Product listing with card-based grid
- Product detail view
- Search (via navbar) and category filters
- Add / remove items, quantity controls
- Cart drawer + dedicated cart page
- Cart state saved in LocalStorage
- Simulated checkout and order confirmation page
- Contact page with Formspree-ready form

## Formspree setup

1. Create a new form on Formspree that sends email to `amaranaeem453@gmail.com`.
2. Copy your form endpoint ID (for example, `https://formspree.io/f/abcd1234`).
3. Update every occurrence of `https://formspree.io/f/your-form-id` in:
   - `ContactForm.tsx`
   - `ProductDetails.tsx`
4. Deploy again after updating so all contact and product inquiry forms send to your Gmail.

## Deploying (Netlify / Vercel)

1. Push this project to GitHub (or another Git host).
2. On **Netlify** or **Vercel**, create a new project from your repo.
3. Use the default settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Your production site will be built from the static Vite output.

