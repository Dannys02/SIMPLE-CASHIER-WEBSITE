# Kasir POS - Sistem Kasir Penjualan

Aplikasi sistem kasir (Point of Sale) berbasis web yang modern, cepat, dan minimalis untuk operasional usaha kuliner skala mikro, kecil, dan menengah (UMKM).

**Bahasa Indonesia** | [**English**](README.md)

---

## 1. Ringkasan Proyek
Kasir POS adalah aplikasi sistem kasir dan pencatatan transaksi penjualan berbasis web. Dibangun dengan arsitektur REST API menggunakan Laravel 11 pada backend serta React 19 dan Tailwind CSS pada frontend, aplikasi ini dirancang untuk memberikan pengalaman pelayanan kasir yang responsif, rapi, dan cepat di desktop maupun smartphone.

## 2. Masalah yang Diselesaikan
- **Kesalahan Rekapitulasi Manual**: Mencegah kekeliruan perhitungan nota kertas melalui penghitungan otomatis kuantitas, harga, dan total belanja pesanan.
- **Antrean Panjang saat Jam Sibuk**: Dilengkapi pencarian menu instan, filter kategori, serta input kuantitas angka langsung agar kasir dapat memproses pesanan banyak dengan cepat.
- **Penghitungan Kembalian Akurat**: Membantu kasir menghitung nominal uang yang diterima dan kembalian pelanggan secara presisi dengan tombol pecahan uang cepat.
- **Dokumentasi dan Pembukuan Penjualan**: Menyediakan ringkasan pendapatan omset harian serta fitur unduh laporan rekap penjualan format PDF siap cetak.

## 3. Fitur Utama
- **Terminal Kasir POS**: Tampilan katalog dengan panel struk tersemat (*sticky*) di desktop serta laci geser (*bottom sheet*) di layar ponsel.
- **Manajemen Menu dan Kategori**: Pengelolaan data makanan dan minuman lengkap dengan dukungan unggah foto menu.
- **Riwayat Penjualan dan Statistik**: Pemantauan histori transaksi, analisis menu terlaris (*top seller*), dan ekspor laporan PDF terstruktur.
- **Autentikasi Aman**: Perlindungan akses sistem kasir berbasis token melalui Laravel Sanctum.

## 4. Panduan Menjalankan Sistem

### Kebutuhan Sistem
- PHP versi 8.2 ke atas
- Composer
- Node.js versi 18 ke atas dan npm
- Database SQLite atau MySQL

### Menjalankan Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
Server API backend akan berjalan di `http://127.0.0.1:8000`.

### Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplikasi web kasir dapat diakses di `http://localhost:5173`.

## 5. Alur Penggunaan
1. **Masuk Akun**: Akses halaman login dan masukkan kredensial akun kasir yang terdaftar.
2. **Pilih Menu Pesanan**: Pada halaman POS Kasir, temukan sajian melalui bar pencarian atau filter kategori menu.
3. **Atur Kuantitas**: Tambahkan item ke keranjang atau ketik langsung angka jumlah pesanan jika pembeli memesan dalam jumlah banyak.
4. **Proses Pembayaran**: Klik proses bayar, masukkan jumlah uang tunai yang diserahkan pelanggan (atau klik opsi uang pas), periksa nilai kembalian, lalu konfirmasi transaksi.
5. **Cetak Rekapan Penjualan**: Masuk ke menu "Riwayat Penjualan" dan klik tombol "Cetak PDF" untuk mengunduh arsip laporan penjualan.
