import React, { useState } from "react";
import { Clock, Tag, ShoppingBag, ArrowRight, ArrowLeft, TrendingUp } from "lucide-react";

export default function Transaction({ loading, transactions, itemsPerPage = 5 }) {
    const [currentPage, setCurrentPage] = useState(1);
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="custom-loader mb-4"></div>
                <p className="text-gray-400 animate-pulse">Memuat riwayat...</p>
            </div>
        );
    }

    // 1. LOGIKA STATISTIK (PRO)
    const totalOmzet = transactions.reduce((acc, curr) => acc + curr.total_price, 0);
    
    // Hitung produk paling laku (Top Seller)
    const productSales = {};
    transactions.forEach(tx => {
        tx.details?.forEach(d => {
            productSales[d.product_name] = (productSales[d.product_name] || 0) + d.qty;
        });
    });
    const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0] || ["-", 0];

    // 2. LOGIKA PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto space-y-6 mb-10">
            
            {/* --- SECTION STATS (Dashboard Look) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Total Omzet</p>
                        <p className="text-xl font-black text-gray-800">Rp {totalOmzet.toLocaleString("id-ID")}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Total Transaksi</p>
                        <p className="text-xl font-black text-gray-800">{transactions.length} Order</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                        <Tag size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Terlaris (Top Seller)</p>
                        <p className="text-xl font-black text-gray-800 max-w-[150px]">{topProduct[0]}</p>
                    </div>
                </div>
            </div>

            {/* --- SECTION LIST TRANSAKSI --- */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-orange-500" /> Riwayat Transaksi
                    </h2>
                </div>

                {transactions.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-400 italic">Belum ada data transaksi.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentItems.map((tx) => (
                            <div key={tx.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-orange-50/50 transition-all border border-transparent hover:border-orange-100">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        {/*<span className="text-[10px] font-mono font-bold bg-white text-gray-400 px-2 py-0.5 rounded border border-gray-200 uppercase">
                                            {tx.reference_no}
                                        </span>*/}
                                        <span className="text-[10px] text-gray-400 font-medium uppercase">
                                            {new Date(tx.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="font-bold text-gray-700 text-sm">
                                        {tx.details?.map(d => `${d.product_name} (x${d.qty})`).join(", ")}
                                    </p>
                                </div>
                                
                                <div className="mt-3 md:mt-0 flex items-center justify-between md:justify-end gap-6">
                                    <div className="w-fit">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Bayar</p>
                                        <p className="font-black text-orange-600 text-lg">Rp {tx.total_price.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* --- PAGINATION CONTROL --- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-bold rounded-xl bg-gray-100 text-gray-500 disabled:opacity-50"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <span className="text-sm font-bold text-gray-400 px-4">
                                    Halaman {currentPage} dari {totalPages}
                                </span>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-bold rounded-xl bg-gray-800 text-white disabled:opacity-50"
                                >
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
