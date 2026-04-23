# Website Kasir Sederhana

Sebuah aplikasi web untuk sistem penjualan (Point of Sale/POS) yang sederhana. Aplikasi ini dirancang untuk membantu pengguna mengelola kategori produk, data produk, dan mencatat transaksi penjualan dengan mudah.

## 📋 Fitur Utama

- **Manajemen Kategori**: Tambah, ubah, dan hapus kategori produk
- **Manajemen Produk**: Tambah, ubah, dan hapus produk beserta gambar produk
- **Keranjang Belanja**: Masukkan produk ke keranjang dengan jumlah yang bisa dikustomisasi
- **Proses Transaksi**: Hitung total pembelian dan catat transaksi penjualan
- **Riwayat Penjualan**: Lihat daftar semua transaksi yang pernah dilakukan
- **Perhitungan Revenue**: Tampilkan total pendapatan dari semua transaksi
- **Autentikasi**: Login dan logout untuk mengamankan aplikasi

## 🛠️ Teknologi yang Digunakan

### Backend
- **Framework**: Laravel 11 (REST API)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **Language**: PHP

### Frontend
- **Framework**: React 19 dengan Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Routing**: React Router 7

## 👤 Peran Saya dalam Project

Saya adalah pengembang utama (full-stack) dalam project ini yang bertanggung jawab untuk:

- Membuat struktur database dengan migrations Laravel
- Mengembangkan API endpoints untuk kategori, produk, dan transaksi
- Membuat model dan controller di sisi backend
- Membangun interface frontend menggunakan React
- Mengintegrasikan komunikasi antara frontend dan backend
- Menerapkan fitur autentikasi sederhana

## 📚 Apa yang Saya Pahami dari Project Ini

### Konsep Backend (Laravel)
- Struktur MVC (Model-View-Controller) dan bagaimana memisahkan logika bisnis
- Routing dan HTTP methods (GET, POST, PUT, DELETE)
- Database migrations untuk membuat struktur tabel
- Eloquent ORM untuk berinteraksi dengan database

### Konsep Frontend (React)
- Component-based architecture (memecah UI menjadi komponen kecil)
- State management dengan `useState` dan props
- Lifecycle dengan `useEffect` untuk fetch data dari API
- React Router untuk navigasi antar halaman

### Konsep Full-Stack
- Arsitektur API REST (client-server)
- Komunikasi HTTP antara frontend dan backend
- CORS (Cross-Origin Resource Sharing)
- Validasi data dari sisi client dan server

## ⚠️ Catatan Pengembangan

### Penggunaan AI
- AI (Claude) membantu dalam:
  - Memberikan penjelasan konsep Laravel dan React
  - Debugging error dan troubleshooting
  - Optimasi struktur kode
  - Penulisan dokumentasi README ini

### Keterbatasan dan Area Pengembangan
Aplikasi ini masih sangat sederhana, beberapa area yang bisa dikembangkan ke depan:
- Validasi input masih dasar
- Performa belum dioptimasi untuk data besar
- UI/UX masih basic, bisa dibuat lebih menarik

## 🚀 Cara Menjalankan Project

### Prasyarat
- PHP 8.1+
- Composer
- Node.js (v16+)
- Database (SQLite atau MySQL)

### Langkah Instalasi

#### 1. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install PHP dependencies
composer install

# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Jalankan migration untuk membuat tabel database
php artisan migrate --seed

# Jalankan server Laravel (default port 8000)
php artisan serve
```

#### 2. Setup Frontend

```bash
# Masuk ke folder frontend (di terminal baru)
cd frontend

# Install dependencies
npm install

# Jalankan development server (default port 5173)
npm run dev
```

#### 3. Buka Aplikasi

Buka browser dan akses:
```
http://localhost:5173
```

Server API akan berjalan di:
```
http://localhost:8000/api
```

### Build untuk Production

```bash
# Frontend
cd frontend
npm run build

# Backend sudah siap, tinggal deploy ke hosting
```

## 📝 Catatan Tambahan

- Project ini dibuat sebagai tugas sekolah RPL
- Kode masih dalam tahap pembelajaran
- Feedback dan saran sangat diterima untuk improvement
- Tidak semua best practices production diterapkan sepenuhnya
