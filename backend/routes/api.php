<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Route untuk Kategori (CategoryList.jsx)
Route::get("/categories", [CategoryController::class, "index"]); // Ambil semua
Route::post("/categories", [CategoryController::class, "store"]); // Tambah
Route::put("/categories/{id}", [CategoryController::class, "update"]); // Edit
Route::delete("/categories/{id}", [CategoryController::class, "destroy"]); // Hapus

// Route untuk Produk (ProductList.jsx)
Route::get("/products", [ProductController::class, "index"]); // Ambil semua
Route::post("/products", [ProductController::class, "store"]); // Tambah
Route::match(["post", "put"], "/products/{id}", [
  ProductController::class,
  "update",
]); // Edit (Pake POST karena kirim file/gambar)
Route::delete("/products/{id}", [ProductController::class, "destroy"]); // Hapus

// Route untuk Transaksi (ProductCard.jsx & Transaction.jsx)
Route::get("/transactions", [TransactionController::class, "index"]); // Lihat Riwayat
Route::post("/transactions", [TransactionController::class, "store"]); // Proses Bayar (Confirm)

// Route autentikasi
Route::post("/login", [AuthenticatedSessionController::class, "store"])
  ->middleware("guest")
  ->name("login");

Route::post("/logout", [AuthenticatedSessionController::class, "destroy"])
  ->middleware("auth:sanctum")
  ->name("logout");
