# Kasir POS - Cashier Management System

A modern, fast, and minimalist Point of Sale (POS) web application designed for small-to-medium food and beverage businesses.

[**Bahasa Indonesia**](README.id.md) | **English**

---

## 1. Overview
Kasir POS is a lightweight web-based Point of Sale and sales tracking system. Built with a Laravel 11 REST API on the backend and React 19 with Tailwind CSS on the frontend, it delivers an intuitive, responsive, and distraction-free checkout experience across desktop and mobile devices.

## 2. Problems It Solves
- **Manual Calculation Errors**: Eliminates pen-and-paper calculation mistakes by automating line-item summaries and total order billing.
- **Slow Checkout During Peak Hours**: Features instant search, category filtering, and direct quantity inputs so cashiers can process high-volume orders rapidly.
- **Accurate Cash and Change Management**: Calculates cash received and customer change with built-in quick cash denominations.
- **Reporting and Archiving**: Provides real-time revenue analytics and single-click PDF sales report generation with automatic pagination.

## 3. Key Capabilities
- **Cashier POS Terminal**: Split-screen desktop catalog with a sticky checkout receipt and a responsive mobile bottom drawer.
- **Menu and Category Management**: Complete CRUD operations for food and beverage items with image upload support.
- **Sales History and Reporting**: Filterable transaction logs, best-selling product tracking, and structured PDF export.
- **Secure Access Control**: Token-based authentication powered by Laravel Sanctum.

## 4. Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18 or higher with npm
- SQLite or MySQL

### Backend Installation
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
The API server will run at `http://127.0.0.1:8000`.

### Frontend Installation
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 5. How to Use
1. **Log In**: Access the login page using authorized cashier credentials.
2. **Select Menu Items**: In the POS Dashboard, search by menu name or filter by category pills.
3. **Adjust Order Quantity**: Click items to add them to the cart, or enter exact quantities directly.
4. **Process Payment**: Open the checkout modal, enter the cash amount received (or click a quick cash button), verify the change, and confirm.
5. **Generate Reports**: Navigate to "Riwayat Penjualan" and click "Cetak PDF" to download the formal sales report.
