
# Bookzy Frontend

**Deployed App:** https://bookzy-frontend-p6gd.vercel.app/

---

## Overview

Bookzy Frontend is a modern, responsive web application for a book marketplace, built with Next.js, TypeScript, Redux Toolkit, and Tailwind CSS. It connects to the Bookzy backend for all data and user actions.

---

## How to Use Locally

1. Clone the repository and go to the `frontend` folder.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and set your backend API URL:
	 ```
	 NEXT_PUBLIC_API_URL = http://localhost:4000/api
	 NEXT_PUBLIC_RAZORPAY_KEY_ID = your_razorpay_key_id
	 ```
4. Start the development server:
	 ```bash
	 npm run dev
	 ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder & File Structure

### Root Files
- `next.config.mjs`, `next-env.d.ts`, `tsconfig.json`, `postcss.config.mjs` — Next.js and TypeScript configuration.
- `package.json`, `package-lock.json` — Dependency management.
- `.env` — Environment variables (not committed).
- `.gitignore` — Files/folders to ignore in git.

### public/
- `icons/` — Payment and UI icons (ads, delivery, paytm, visa, etc.)
- `images/` — Book images, cart, logo, etc.

### src/
- `app/` — Main app pages and layouts
	- `about-us/`, `privacy-policy/`, `terms-of-use/`, `verify-email/`, `reset-password/`, `book-sell/`, `books/`, `checkout/`, `account/` — Feature pages
	- `components/` — UI components for pages (AuthPage, CartItems, Footer, Header, NewBooks, NoData, Pagination, PriceDetails, Share)
	- `layout.tsx`, `LayoutWrapper.tsx`, `globals.css` — App layout and global styles
- `components/ui/` — Custom UI components
- `lib/` — Shared logic and types
	- `BookLoader.tsx`, `Constant.ts`, `NoData.js`, `types/type.ts`, `utils.ts`
- `store/` — Redux Toolkit store and slices
	- `api.ts` — RTK Query API logic
	- `Provider/AuthProvider.tsx` — Auth context provider
	- `slice/` — Redux slices (cartSlice, checkoutSlice, userSlice, wishlistSlice)
	- `store.ts` — Store setup

---

## Main Features

- **Authentication:** Login, register, email verification, Google OAuth, password reset
- **Product Browsing:** View books, search, filter, pagination
- **Sell Books:** Add new books with images and payment details
- **Cart & Wishlist:** Add/remove items, view details, move between cart and wishlist
- **Checkout & Orders:** Address management, payment via Razorpay, order history
- **Responsive Design:** Mobile-friendly, modern UI with Tailwind CSS
- **Notifications:** Toasts for actions and errors
- **API Integration:** Connects to Bookzy backend for all data

---

## Environment Variables (.env)

Example keys to set in `.env`:
```
NEXT_PUBLIC_API_URL = http://localhost:4000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID = your_razorpay_key_id
```

---

## Deployment

- The frontend is live at:  
	**https://bookzy-frontend-p6gd.vercel.app/api**
- Use this for production or demo access.

---

## Contribution & Issues

- Open an issue or pull request for bugs, features, or improvements.
