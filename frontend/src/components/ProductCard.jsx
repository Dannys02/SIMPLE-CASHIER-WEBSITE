import React, { useState, useMemo } from "react";
import { 
    Search, 
    ShoppingCart, 
    X, 
    Plus, 
    Minus, 
    Trash2, 
    Check, 
    TrendingUp, 
    Receipt, 
    CreditCard, 
    Coins, 
    UtensilsCrossed, 
    RotateCcw 
} from "lucide-react";
import axios from "axios";

export default function ProductCard({
    loading,
    products,
    categories,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    revenue,
    fetchData
}) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isCartMobileOpen, setIsCartMobileOpen] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [cashReceived, setCashReceived] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [lastTransactionSummary, setLastTransactionSummary] = useState(null);

    const STORAGE_URL = "http://127.0.0.1:8000/storage/";

    // Hitung total item & total belanja
    const totalItemsCount = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.qty, 0);
    }, [cart]);

    const totalHargaKeranjang = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    }, [cart]);

    // Filter produk berdasarkan kategori dan pencarian keyword
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = 
                selectedCategory === "all" || product.category_id === Number(selectedCategory);
            const matchesSearch = 
                product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    // Helper update quantity langsung (manual / cepat)
    const updateQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            deleteFromCart(productId);
            return;
        }
        setCart(prev => 
            prev.map(item => item.id === productId ? { ...item, qty: newQty } : item)
        );
    };

    // Hapus seluruh baris produk dari cart
    const deleteFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    // Kalkulasi kembalian uang tunai
    const numericCashReceived = Number(cashReceived) || 0;
    const changeAmount = Math.max(0, numericCashReceived - totalHargaKeranjang);

    // Buka dialog checkout dan siapkan uang pas sebagai default
    const handleOpenCheckout = () => {
        if (cart.length === 0) return;
        setCashReceived(totalHargaKeranjang.toString());
        setShowCheckoutModal(true);
    };

    // Quick cash options
    const quickCashOptions = useMemo(() => {
        if (totalHargaKeranjang === 0) return [];
        const base = totalHargaKeranjang;
        const options = [base];
        const roundToNext = (val, round) => Math.ceil(val / round) * round;
        
        [10000, 20000, 50000, 100000].forEach(denom => {
            const rounded = roundToNext(base, denom);
            if (rounded > base && !options.includes(rounded)) {
                options.push(rounded);
            }
        });
        return options.slice(0, 4);
    }, [totalHargaKeranjang]);

    const handleConfirmTransaction = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await axios.post("http://127.0.0.1:8000/api/transactions", {
                total_price: totalHargaKeranjang,
                cart: cart
            });

            setLastTransactionSummary({
                total: totalHargaKeranjang,
                itemsCount: totalItemsCount,
                cash: numericCashReceived,
                change: changeAmount
            });

            setCart([]);
            setShowCheckoutModal(false);
            setIsCartMobileOpen(false);
            setSuccessModal(true);
            await fetchData();

            setTimeout(() => {
                setSuccessModal(false);
            }, 3500);
        } catch (error) {
            console.error(error);
            alert("Gagal memproses transaksi! Periksa koneksi backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-24 lg:pb-8">
            {/* Top Bar: Statistik Singkat & Header */}
            <div className="bg-white rounded-2xl p-5 mb-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        Pusat Penjualan (POS)
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Layanan pemesanan cepat untuk pelanggan meja & bawa pulang
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-orange-50 border border-orange-100/80 rounded-2xl px-5 py-3 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600/80">
                                Total Omset Hari Ini
                            </span>
                            <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                                Rp {revenue.toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Utama: 2 Kolom (Katalog Produk & Struk Kasir) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* KOLOM KIRI (Katalog Produk & Filter) - 8 Kolom */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                    {/* Search Bar & Filter Kategori */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3.5">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari nama menu (misal: Geprek, Es Teh)..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Pills Kategori */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 custom-scrollbar">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === "all"
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                }`}
                            >
                                Semua Menu ({products.length})
                            </button>
                            {categories.map(cat => {
                                const count = products.filter(p => p.category_id === cat.id).length;
                                const isSelected = selectedCategory === cat.id.toString() || selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id.toString())}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                            isSelected
                                                ? "bg-orange-600 text-white shadow-sm shadow-orange-500/20"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                        }`}
                                    >
                                        {cat.name} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grid Daftar Produk */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl border border-slate-200/80 p-8">
                            <div className="custom-loader mb-4"></div>
                            <p className="text-sm font-medium text-slate-400 animate-pulse">
                                Memuat daftar produk...
                            </p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[35vh] bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center mb-3">
                                <UtensilsCrossed size={28} />
                            </div>
                            <h3 className="text-base font-bold text-slate-700">Produk Tidak Ditemukan</h3>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                {searchQuery 
                                    ? `Tidak ada menu dengan nama "${searchQuery}". Coba kata kunci lain.`
                                    : "Belum ada produk yang tersedia pada kategori ini."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                            {filteredProducts.map(product => {
                                const cartItem = cart.find(c => c.id === product.id);
                                const isAdded = Boolean(cartItem);

                                return (
                                    <div
                                        key={product.id}
                                        className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                                            isAdded 
                                                ? "border-orange-500/60 ring-2 ring-orange-500/10 shadow-md" 
                                                : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-100">
                                            <img
                                                src={
                                                    product.image
                                                        ? STORAGE_URL + product.image
                                                        : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"
                                                }
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {isAdded && (
                                                <span className="absolute top-2 right-2 bg-orange-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-sm">
                                                    x{cartItem.qty}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                                            <div>
                                                <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm sm:text-base font-extrabold text-orange-600 mt-1">
                                                    Rp {product.price.toLocaleString("id-ID")}
                                                </p>
                                            </div>

                                            {/* Action Button: Tambah / Kontrol Qty */}
                                            {isAdded ? (
                                                <div className="flex items-center justify-between bg-orange-50 p-1 rounded-xl border border-orange-200/60">
                                                    <button
                                                        onClick={() => removeFromCart(product.id)}
                                                        className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all shadow-xs"
                                                        aria-label="Kurangi jumlah"
                                                    >
                                                        <Minus size={14} strokeWidth={2.5} />
                                                    </button>
                                                    <span className="text-xs font-black text-orange-700 px-2">
                                                        {cartItem.qty}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="w-8 h-8 rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center transition-all shadow-xs"
                                                        aria-label="Tambah jumlah"
                                                    >
                                                        <Plus size={14} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                                                >
                                                    <Plus size={14} strokeWidth={2.5} />
                                                    <span>Tambah</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* KOLOM KANAN (Keranjang Kasir Desktop - Sticky) - 4 Kolom */}
                <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-6rem)]">
                        {/* Header Panel */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                                    <Receipt size={16} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 leading-tight">Keranjang Kasir</h2>
                                    <span className="text-[11px] text-slate-400">{totalItemsCount} item dipilih</span>
                                </div>
                            </div>
                            {cart.length > 0 && (
                                <button
                                    onClick={() => setCart([])}
                                    className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-all flex items-center gap-1"
                                    title="Kosongkan Keranjang"
                                >
                                    <RotateCcw size={13} />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>

                        {/* List Item Keranjang */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                                        <ShoppingCart size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-600">Keranjang Masih Kosong</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Pilih produk dari katalog di sebelah kiri untuk memulai transaksi.
                                    </p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div
                                        key={item.id}
                                        className="p-3 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 rounded-xl transition-all flex items-center gap-3"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                                            <p className="text-[11px] font-semibold text-slate-400">
                                                Rp {item.price.toLocaleString("id-ID")}
                                            </p>
                                            <p className="text-xs font-black text-orange-600 mt-0.5">
                                                Rp {(item.price * item.qty).toLocaleString("id-ID")}
                                            </p>
                                        </div>

                                        {/* Counter Controls */}
                                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-7 h-7 rounded text-slate-600 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all"
                                            >
                                                <Minus size={13} strokeWidth={2.5} />
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.qty}
                                                onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                className="w-10 text-center text-xs font-black text-slate-800 bg-transparent focus:outline-none"
                                            />
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-7 h-7 rounded text-slate-600 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center transition-all"
                                            >
                                                <Plus size={13} strokeWidth={2.5} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => deleteFromCart(item.id)}
                                            className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                                            title="Hapus item"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Checkout Panel */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Total Tagihan
                                </span>
                                <span className="text-xl font-black text-slate-900">
                                    Rp {totalHargaKeranjang.toLocaleString("id-ID")}
                                </span>
                            </div>

                            <button
                                disabled={cart.length === 0}
                                onClick={handleOpenCheckout}
                                className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                                    cart.length === 0
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                        : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20 active:scale-[0.99]"
                                }`}
                            >
                                <CreditCard size={18} />
                                <span>Proses Pembayaran (F4)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOATING ACTION BAR FOR MOBILE (Bottom Bar) */}
            {cart.length > 0 && (
                <div className="lg:hidden fixed bottom-4 left-3 right-3 z-30">
                    <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <button
                            onClick={() => setIsCartMobileOpen(true)}
                            className="flex items-center gap-3 text-left flex-1"
                        >
                            <div className="relative w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                                <ShoppingCart size={18} />
                                <span className="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                                    {totalItemsCount}
                                </span>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-400 font-medium">Total Pesanan</span>
                                <p className="text-base font-extrabold text-white leading-tight">
                                    Rp {totalHargaKeranjang.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={handleOpenCheckout}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md shadow-orange-600/30 whitespace-nowrap active:scale-95 transition-all"
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                </div>
            )}

            {/* MOBILE CART DRAWER (Bottom Sheet) */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
                    isCartMobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
            >
                <div 
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                    onClick={() => setIsCartMobileOpen(false)}
                />
                <div
                    className={`absolute bottom-0 inset-x-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl transition-transform duration-300 ${
                        isCartMobileOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                >
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3" />
                    <div className="px-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Daftar Belanja</h3>
                            <p className="text-xs text-slate-400">{totalItemsCount} total produk dipilih</p>
                        </div>
                        <button
                            onClick={() => setIsCartMobileOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-3"
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                                    <p className="text-xs text-orange-600 font-extrabold mt-0.5">
                                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-7 h-7 rounded text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="w-7 h-7 rounded text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => deleteFromCart(item.id)}
                                    className="text-slate-300 hover:text-rose-500 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold text-slate-500 uppercase">Total Tagihan</span>
                            <span className="text-xl font-black text-slate-900">
                                Rp {totalHargaKeranjang.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <button
                            onClick={handleOpenCheckout}
                            className="w-full py-3.5 rounded-xl bg-orange-600 font-extrabold text-sm text-white shadow-md shadow-orange-600/30"
                        >
                            Lanjut ke Pembayaran
                        </button>
                    </div>
                </div>
            </div>

            {/* CHECKOUT MODAL / POPUP PEMBAYARAN KASIR */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                    showCheckoutModal ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                }`}
            >
                <div 
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                    onClick={() => !isSubmitting && setShowCheckoutModal(false)}
                />
                <div
                    className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-100 transition-all duration-300 ${
                        showCheckoutModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                >
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Coins size={22} />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-slate-800">Pembayaran Kasir</h3>
                                <p className="text-xs text-slate-400">Pastikan nominal uang yang diterima tepat</p>
                            </div>
                        </div>
                        <button
                            disabled={isSubmitting}
                            onClick={() => setShowCheckoutModal(false)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="mt-5 space-y-4">
                        {/* Total Belanja */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-baseline">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                Total Tagihan
                            </span>
                            <span className="text-2xl font-black text-orange-600">
                                Rp {totalHargaKeranjang.toLocaleString("id-ID")}
                            </span>
                        </div>

                        {/* Input Uang Diterima */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Uang Diterima (Cash)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    min={totalHargaKeranjang}
                                    value={cashReceived}
                                    onChange={e => setCashReceived(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-lg font-black text-slate-800 focus:outline-none focus:border-orange-500 transition-all"
                                />
                            </div>

                            {/* Tombol Uang Cepat (Quick Cash Buttons) */}
                            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
                                {quickCashOptions.map((amount, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCashReceived(amount.toString())}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 rounded-lg text-xs font-bold whitespace-nowrap transition-all border border-slate-200/60"
                                    >
                                        {amount === totalHargaKeranjang ? "Uang Pas" : `Rp ${amount.toLocaleString("id-ID")}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Kalkulasi Kembalian */}
                        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 flex justify-between items-baseline">
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                                Kembalian
                            </span>
                            <span className="text-xl font-black text-emerald-700">
                                Rp {changeAmount.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setShowCheckoutModal(false)}
                            className="flex-1 py-3 text-xs sm:text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting || numericCashReceived < totalHargaKeranjang}
                            onClick={handleConfirmTransaction}
                            className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                                numericCashReceived < totalHargaKeranjang
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                    : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20 active:scale-95"
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">Menyimpan...</span>
                            ) : (
                                <>
                                    <Check size={18} strokeWidth={3} />
                                    <span>Konfirmasi & Cetak</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* POPUP NOTIFIKASI SUKSES */}
            <div
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
                    successModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
                }`}
            >
                <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Check size={20} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Transaksi Berhasil Dicatat!</p>
                        {lastTransactionSummary && (
                            <p className="text-xs text-slate-400">
                                Total: Rp {lastTransactionSummary.total.toLocaleString("id-ID")} • Kembalian: Rp {lastTransactionSummary.change.toLocaleString("id-ID")}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
