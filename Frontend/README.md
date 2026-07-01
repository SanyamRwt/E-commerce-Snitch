# Cartify

> **Wear it. Own it.**

Cartify is a premium fashion e-commerce platform built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit (global state)
- React Router v7
- Tailwind CSS v4
- Axios
- Razorpay (payments)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- Passport.js (Google OAuth)
- Razorpay SDK
- ImageKit (media uploads)

---

## Project Structure

```
SNITCH/
├── Frontend/          # React + Vite app
│   ├── src/
│   │   ├── app/           # Store, routes, layout
│   │   └── features/
│   │       ├── auth/      # Login, Register, Profile
│   │       ├── cart/      # Cart state, hook, pages
│   │       ├── products/  # Product listing & detail
│   │       └── shared/    # Nav, shared components
│   └── index.html
│
└── Backend/           # Express API
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── services/
        └── dao/
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB instance (local or Atlas)

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

---

## Environment Variables

Create `Backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

---

## Key Features

- 🛒 **Smart Cart** — Deduplication by product+variant; increment quantity on re-add
- 🔐 **Auth** — JWT sessions + Google OAuth
- 💳 **Payments** — Razorpay integration with server-side verification
- 📦 **Inventory** — Per-variant stock tracking
- 🖼️ **Media** — ImageKit CDN uploads for product images
- 👤 **Roles** — Buyer and Seller roles with protected routes

---

## Tagline

**Cartify — Wear it. Own it.**
