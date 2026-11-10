import React, { useState } from "react";
import { 
    Clock, 
    ShoppingBag, 
    TrendingUp, 
    ChevronLeft, 
    ChevronRight, 
    Calendar, 
    Hash, 
    FileText 
} from "lucide-react";

export default function Transaction({ loading, transactions, itemsPerPage = 8 }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrx, setSelectedTrx] = useState(null);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="custom-loader mb-3"></div>
                <p className="text-xs font-semibold text-slate-400 animate-pulse">
                    Memuat riwayat transaksi...
                </p>
            </div>
        );
    }

    // STATISTIK
    const totalOmzet = transactions.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);
    const totalTransaksi = transactions.length;

    // Hitung produk terlaris
    const productSales = {};
    transactions.forEach(tx => {
        tx.details?.forEach(d => {
            productSales[d.product_name] = (productSales[d.product_name] || 0) + (d.qty || 1);
        });
    });
    const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0] || ["Belum ada", 0];

    // PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* KPI STATISTIK KARTU */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Pemasukan */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pemasukan</span>
                        <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                            Rp {totalOmzet.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>

                {/* Total Transaksi */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Transaksi</span>
                        <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                            {totalTransaksi} Checkout
                        </p>
                    </div>
                </div>

                {/* Menu Terlaris */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileText size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Menu Terlaris</span>
                        <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5 truncate">
                            {topProduct[0]}
                        </p>
                        <span className="text-[11px] text-emerald-600 font-bold">
                            Terjual {topProduct[1]} porsi
                        </span>
                    </div>
                </div>
            </div>

            {/* TABEL RIWAYAT TRANSAKSI */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Riwayat Penjualan Terbaru</h3>
                        <p className="text-xs text-slate-400">Daftar rekapan transaksi pesanan pembeli</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4 sm:px-6">No. Referensi</th>
                                <th className="py-3.5 px-4 sm:px-6">Waktu Transaksi</th>
                                <th className="py-3.5 px-4 sm:px-6">Rincian Menu Dipesan</th>
                                <th className="py-3.5 px-4 sm:px-6 text-right">Total Tagihan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-14 text-center text-slate-400">
                                        Belum ada riwayat transaksi penjualan.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map(item => {
                                    const dateObj = new Date(item.created_at);
                                    const dateFormatted = !isNaN(dateObj)
                                        ? dateObj.toLocaleDateString("id-ID", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric"
                                          })
                                        : "-";
                                    const timeFormatted = !isNaN(dateObj)
                                        ? dateObj.toLocaleTimeString("id-ID", {
                                              hour: "2-digit",
                                              minute: "2-digit"
                                          })
                                        : "";

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-800">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 text-xs">
                                                    <Hash size={12} className="text-slate-400" />
                                                    {item.reference_no}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                    <Calendar size={13} className="text-slate-400" />
                                                    <span>{dateFormatted}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span>{timeFormatted}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 sm:px-6">
                                                <div className="flex flex-wrap gap-1.5 max-w-md">
                                                    {item.details && item.details.length > 0 ? (
                                                        item.details.map((d, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100 text-[11px] font-semibold text-orange-800"
                                                            >
                                                                <span>{d.product_name}</span>
                                                                <span className="font-extrabold text-orange-600">x{d.qty}</span>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Detail item tidak tercatat
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 sm:px-6 text-right font-black text-orange-600 text-sm sm:text-base">
                                                Rp {Number(item.total_price).toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">
                            Menampilkan halaman <b className="text-slate-700">{currentPage}</b> dari <b className="text-slate-700">{totalPages}</b>
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
