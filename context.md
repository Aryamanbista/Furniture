# FurniHome Application - Project Context

This file provides a comprehensive overview of the FurniHome project. It is designed to be provided as context to Large Language Models (LLMs) to understand the architecture, tech stack, and structure of the application.

## 1. Project Overview

FurniHome is a modern, full-stack web application for an online furniture retailer. It features a stunning, premium user interface, customer authentication, product browsing/filtering, a shopping cart/checkout flow, order history tracking, product reviews, a geographic store locator, and a protected admin dashboard for inventory management and sales analytics.

## 2. Tech Stack

### Frontend

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (v4) + `tailwind-merge` + `clsx`
- **Routing:** React Router v7
- **State Management:** React Context API (`AppContext`, `AuthContext`)
- **Animations:** Framer Motion (page transitions, scroll animations, micro-interactions)
- **Icons:** Lucide React & Heroicons
- **Maps:** Leaflet & React Leaflet (for Store Locator)
- **Charts:** Recharts (for Admin Sales Dashboard)
- **PDF Generation:** jsPDF (for Order Receipts)
- **Payments:** PayPal React JS (integrated in checkout)

### Backend

- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs (password hashing)
- **Middleware:** CORS, Express JSON parser, Custom Auth/RBAC middleware
- **Environment Management:** `dotenv`
- **Environment:** Runs on port `5001` (to avoid macOS AirPlay Receiver port 5000 conflicts)

## 3. Architecture & File Structure

The project is structured as a monorepo containing both frontend and backend code.

```text
/
├── server/                 # Backend Node.js/Express application
│   ├── models/             # Mongoose schemas (User, Product, Order, Review, Store)
│   ├── routes/             # Express API routers (auth, products, orders, etc.)
│   ├── middleware/         # Custom Middlewares (auth.js for JWT & Admin checks)
│   ├── server.js           # Main Express entry point & MongoDB connection
│   ├── seed.js             # Database seeding script for mock data
│   ├── .env                # Backend environment variables
│   └── package.json        # Backend dependencies
│
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components (ProductCard, Header, Footer)
│   │   └── ui/             # Micro-components (Modal, StarRating, InteractiveMap)
│   ├── context/            # React Context providers (AuthContext, AppContext)
│   ├── data/               # Static/fallback mock data & utility functions
│   ├── pages/              # React route components (Home, Shop, Admin, Checkout, etc.)
│   ├── services/           # Service layer abstractions (api.js - fetch wrappers)
│   ├── utils/              # Utility functions (pdfGenerator.js)
│   ├── App.jsx             # Main application component & React Router setup
│   ├── index.css           # Global Tailwind CSS & custom design tokens
│   └── main.jsx            # React root injection
│
├── index.html              # Vite HTML entry point
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # (Optional) Tailwind custom overrides
```

## 4. Key Implementation Details

### Database Schema (MongoDB / Mongoose)

1.  **User:** `name`, `email` (unique), `password` (hashed), `role` (customer/admin), `memberSince`.
2.  **Product:** `name`, `category`, `price`, `images`, `description`, `dimensions`, `materials`, `stock status`, `sale status`, etc. Includes a text index for searchability.
3.  **Order:** `user` reference, embedded `items` array, `total`, `status` (processing/shipped/delivered), `shippingInfo`. Generates a unique `orderId`.
4.  **Review:** `productId` (indexed), `userId` reference, `userName` (denormalized), `rating`, `title`, `content`.
5.  **Store:** `name`, `address`, geographical `coordinates`, `hours`, `isOpen` status.

### Authentication Flow

1.  User submits credentials to `/api/auth/login` or `/api/auth/register`.
2.  Backend issues a signed JWT containing the user's `userId`.
3.  Frontend stores the JWT in `localStorage` (`furnihome_token`).
4.  Subsequent API requests (via `src/services/api.js`) automatically attach the token in the `Authorization: Bearer <token>` header.
5.  Backend `auth` middleware intercepts, verifies the JWT, and attaches the user document to `req.user`.

### Frontend Data Fetching & State

- The frontend relies entirely on a centralized `api.js` service layer (e.g., `productsAPI.getAll()`, `ordersAPI.create()`).
- `AppContext` fetches and caches global resources (like the product catalog) on mount.
- Private routes and admin routes are protected by checking `isAuthenticated` and `isAdmin` flags exposed by `AuthContext`.
- MongoDB specifically uses `_id` as the primary key. Frontend components use `item._id || item.id` to gracefully support both the new MongoDB schema and legacy mock objects.

## 5. Next Steps / Current State

- The transition from purely static, local-storage mock data to a fully functional REST API is complete.
- The frontend is wired to the Express backend running locally on `http://localhost:5001`.
- All core functionality (browsing, authentication, adding to cart, checkout, viewing history, leaving reviews, searching map, admin dashboard) is structurally complete and functional.
