# 🛋️ FurniHome

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.29-FF0055?style=for-the-badge&logo=framer&logoColor=white)

**A Modern, Premium E-Commerce Platform for Luxury Furniture**

[Live Demo](#) · [Features](#-features) · [Installation](#-installation) · [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🛒 **Shopping Experience**

- **Product Catalog** - Browse through a curated collection of premium furniture
- **Advanced Search** - Find products quickly with real-time search
- **Product Details** - View detailed information, images, and specifications
- **Category Filtering** - Filter by sofas, chairs, tables, beds, and more

### 🎨 **Modern UI/UX**

- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Premium Aesthetics** - Elegant gradients, shadows, and glassmorphism effects

### 🔐 **Authentication & User Management**

- **User Registration** - Create accounts with email and password
- **Secure Login** - Protected user sessions
- **Order History** - View past orders and track purchases
- **PDF Receipts** - Download invoices for completed orders

### 👨‍💼 **Admin Dashboard**

- **Product Management** - Add, edit, and delete products
- **Inventory Tracking** - Monitor stock levels and availability
- **Visual Statistics** - Dashboard with key metrics and insights
- **Category Management** - Organize products by categories

### 💳 **Checkout & Payments**

- **Shopping Cart** - Add/remove items with quantity management
- **PayPal Integration** - Secure payment processing
- **Order Confirmation** - Instant order receipts

### 📍 **Store Locator**

- **Find Showrooms** - Locate nearby physical stores
- **Store Details** - View addresses, hours, and contact info

---

## 🛠️ Tech Stack

| Category           | Technology              |
| ------------------ | ----------------------- |
| **Framework**      | React 19                |
| **Build Tool**     | Vite 7                  |
| **Styling**        | Tailwind CSS 4          |
| **Animations**     | Framer Motion           |
| **Routing**        | React Router DOM 7      |
| **Icons**          | Heroicons, Lucide React |
| **Payments**       | PayPal React SDK        |
| **PDF Generation** | jsPDF                   |

---

## 📦 Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aryamanbista/Furniture.git
   cd Furniture
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Credentials

| Role      | Email                  | Password   |
| --------- | ---------------------- | ---------- |
| **Admin** | `admin@furnihome.com`  | `admin123` |
| **User**  | Register a new account | -          |

---

## 📁 Project Structure

```
furnihome/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── ui/          # Base UI components
│   ├── context/         # React Context providers
│   │   ├── AppContext.jsx    # Cart & Products state
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── ThemeContext.jsx  # Theme management
│   ├── pages/           # Route components
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Checkout.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   └── ...
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json
```

---

## 🎯 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 🌟 Key Highlights

- ⚡ **Lightning Fast** - Powered by Vite for instant HMR
- 🎨 **Beautiful UI** - Premium design with attention to detail
- 📱 **Fully Responsive** - Works on all device sizes
- 🌙 **Dark Mode** - Easy on the eyes, day or night
- 🔒 **Role-based Access** - Admin and user permissions
- 📄 **PDF Receipts** - Professional order documentation

---

## 📸 Screenshots

<div align="center">

### Home Page

_Premium landing page with featured products and categories_

### Product Details

_Detailed product view with images, specifications, and add to cart_

### Admin Dashboard

_Manage products, view statistics, and control inventory_

### Checkout

_Secure checkout with PayPal integration_

</div>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is created for educational purposes as part of **BIT310 Web Technologies** coursework.

---

<div align="center">

**Made with ❤️ using React & Tailwind CSS**

⭐ Star this repo if you found it useful!

</div>
