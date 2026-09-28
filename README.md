# 🛍️ Noor's Handmade Bangles - Online Shop & Admin PWA

A zero-cost, high-performance, mobile-first e-commerce web application for **Noor's Handmade Bangles business**. Built with pure HTML, CSS, and Vanilla JavaScript (ES modules) with **zero build steps**, hosted directly on GitHub Pages, and powered by Supabase (Postgres, Auth, Storage, and RLS).

---

## 🌟 Shop Details
- **Shop Name**: Noor's
- **Facebook Page**: [https://www.facebook.com/profile.php?id=61579870612718](https://www.facebook.com/profile.php?id=61579870612718)
- **WhatsApp Support**: +8801914-992749
- **bKash & Nagad**: 01719970286
- **Currency**: BDT (৳)
- **Delivery Charges**: Inside Dhaka ৳70 | Outside Dhaka ৳140

---

## 🚀 Beginner Setup Guide (Step-by-Step)

### Step 1: Create GitHub Repository & Push Code
1. Log in to your GitHub account and create a new public repository named `noors-bangles`.
2. Push all the files from this directory to the `main` branch of your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Noor's Online Shop"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/noors-bangles.git
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages Deployment
1. Open your repository on GitHub.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow file `.github/workflows/deploy.yml` will automatically build and deploy your website to `https://YOUR_USERNAME.github.io/noors-bangles/` on every push!

### Step 3: Create a Free Supabase Backend Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, name it `noors-bangles`, set a secure database password, and choose **Singapore (ap-southeast-1)** as the region.
3. Once the project is created:
   - Go to **Project Settings** > **API**.
   - Copy your **Project URL** (e.g. `https://xyzcompany.supabase.co`) and your **anon public key** (`eyJhbGci...`).

### Step 4: Run the Database Schema & SQL Setup
1. In your Supabase dashboard, click **SQL Editor** in the left menu.
2. Click **New Query**, open the file [`supabase/schema.sql`](supabase/schema.sql) from this repository, copy its entire contents, paste it into the editor, and click **Run**.
3. This will instantly create:
   - All 8 database tables (`products`, `categories`, `orders`, `order_items`, `discount_codes`, `reviews`, `custom_orders`, `shop_settings`)
   - Strict Row Level Security (RLS) policies
   - Secure Postgres RPC function `track_order`
   - Order rate limiting triggers
   - Sample seed data (8 handmade bangle sets)

### Step 5: Create Your Admin User Account
1. In your Supabase dashboard, click **Authentication** > **Users** > **Add User** > **Create User**.
2. Enter your admin email (e.g. `admin@noors.com`) and a strong password (e.g. `admin123`).
3. Turn on **Auto Confirm User** so you can log in immediately.

### Step 6: Paste Supabase Keys into `assets/js/config.js`
Open [`assets/js/config.js`](assets/js/config.js) and update lines 24–25 with your actual Supabase credentials:
```javascript
SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
```
Commit and push this change to GitHub to connect your live frontend to Supabase!

### Step 7: Add Shop Link to Your Facebook Page
Go to your Facebook Page [Noor's](https://www.facebook.com/profile.php?id=61579870612718), click **Edit Details**, and add your website URL `https://YOUR_USERNAME.github.io/noors-bangles/`.

---

## 🔒 Security & Architecture Overview

> [!IMPORTANT]
> **Why is the `anon` key public by design?**
> In Supabase architecture, the `anon` API key is designed to be embedded directly into client-side code. Data security is enforced entirely on the database server through **Row Level Security (RLS)**:
> - Anonymous visitors can ONLY read active products, categories, approved reviews, and discount codes.
> - Anonymous visitors can ONLY insert new orders and reviews.
> - ONLY authenticated Admin users can update, delete, or read customer orders.
> - Never expose the `service_role` key in frontend code!

---

## 📱 Short Admin User Guide

Access the mobile-first Admin Panel by navigating to `https://YOUR_USERNAME.github.io/noors-bangles/#admin` on your phone or computer.

### 1. How to Add a New Bangle Product
1. Log in to the Admin Panel.
2. Click the **🛍️ Products** tab and press **+ Add New Bangle**.
3. Fill in the product details (Name, Price, Old Price for strike-through discount, Stock, Category).
4. Tap **Choose File** to pick a photo from your phone camera or gallery. The browser will **automatically compress and convert the photo to WebP (< 300 KB, max 1200px)**.
5. Tap **Save Bangle**.

### 2. How to Start a Discount Campaign
1. Click the **🏷️ Discounts** tab.
2. Click **Apply 10% Off All Bangles** or enter a promo code (e.g., `EID200` for ৳200 off).
3. The old price will automatically show crossed out in the customer store!

### 3. How to Process & Deliver an Order
1. Click the **📦 Orders** tab to see incoming customer orders.
2. To notify the customer, tap **💬 WhatsApp Customer** to send a pre-filled 1-tap update message directly to their phone!
3. To print a clean receipt for delivery, tap **🖨️ Packing Slip**.
4. Change the status dropdown from `PENDING` -> `CONFIRMED` -> `PACKED` -> `SHIPPED` -> `DELIVERED`. Customers can track this live!
5. Tap **📥 Export Orders CSV** anytime to download your sales records for Excel or Google Sheets.

---

## 🛠️ Local Verification & Development
You can test the entire site locally using any simple HTTP web server (e.g. VS Code Live Server or Python `http.server`):
```bash
npx http-server . -p 8080
```
Open `http://localhost:8080` in your browser.
