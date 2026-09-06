
# 👑 Fashionvillaroyal - Luxury E-Commerce Platform

Fashionvillaroyal is a full-featured, luxury E-Commerce website built with React, Vite, and Tailwind CSS. It features a complete Client Shopping Portal and Admin Management Panel.

---

## 🌟 Key Features

### 🛍️ Client Site
- **Home Page**: Hero banner slider, curated categories grid, featured products, royal concierge guarantee, customer testimonials.
- **Product Listing**: Category & subcategory filter, max price slider in **Rupees (₹)**, color/size variant filters, sort by price & rating, list/grid view toggle.
- **Product Details & Gallery**:
  - 📸 **10+ Image Gallery**: Thumbnail selector scrollbar with 10 to 20 photos per product.
  - 🔍 **Image Zoom Lens & Fullscreen Lightbox**: Hover magnifying lens zoom and click-to-open full-screen lightbox modal.
  - 💰 **Price & Discount**: Prices in Rupees (₹) with crossed out regular price and discount percentage tag.
  - 🎨 **Variants Matrix**: Dynamic color and size selection updating price and stock in real-time.
  - 🛒 **Add to Cart & Wishlist**: Quantity selector, instant cart drawer trigger, wishlist heart toggle.
  - ⭐ **Reviews & Ratings**: Score breakdown, rating stats bar, reviews list with photos, and **interactive review submission form**.
- **Cart & Checkout**:
  - Sliding Cart drawer with free express shipping progress bar (₹10,000 threshold).
  - Multi-step Checkout page: Address form, UPI / Cash on Delivery (COD) / Credit Card payment options, promo coupon discount (`ROYAL10`).
- **Orders Page**: Track order timeline and past purchases.
- **Theme**: Dark/Light mode toggle switch.

---

## 🔐 Admin Panel
- **Admin Login**: Demo login with one-click credentials auto-fill (`admin@fashionvillaroyal.com` / `admin123`).
- **Dashboard**: KPI cards for Total Sales (₹), Orders Count, Product Inventory, and Active Customers; Low stock alerts.
- **Product Management (CRUD)**:
  - ➕ Add / Edit / Delete products.
  - 📸 **Manage 10-20 Product Photos**.
  - 🖼️ **Drag-and-Drop Image Reordering**.
  - ⭐ **Select Main / Featured Cover Image**.
  - 💰 Regular price and Sale price (₹).
  - 📈 **Variant Customization**: Custom price override and stock level per variant.
  - 📦 Stock & SKU management.
  - 👁️ Publish / Unpublish product toggle.
- **Customer Management**: Patron list, order history, and spending in ₹.
- **Order Desk**: View orders and update status (Processing, Shipped, Delivered, Cancelled).

---

## 🚀 Quick Start Instructions

1. Install dependencies:
```bash
npm install
```

2. Run local development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

3. Build production bundle:
```bash
npm run build
```

4. Create Downloadable Package & ZIP Archive:
```bash
npm run package
```
This generates:
- `Fashionvillaroyal-Release/` folder
- `Fashionvillaroyal-website.zip`
