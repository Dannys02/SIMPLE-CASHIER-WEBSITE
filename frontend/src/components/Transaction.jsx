import React, { useState } from "react";
import { 
    Clock, 
    ShoppingBag, 
    TrendingUp, 
    ChevronLeft, 
    ChevronRight, 
    Calendar, 
    Hash, 
    FileText,
    Download
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Transaction({ loading, transactions, itemsPerPage = 8 }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

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

    // FUNGSI EXPORT LAPORAN PDF
    const exportToPDF = () => {
        if (transactions.length === 0) {
            alert("Tidak ada data transaksi untuk dicetak!");
            return;
        }

        setIsExporting(true);
        try {
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            // 1. Header Banner & Info Usaha
            doc.setFillColor(24, 24, 27); // Dark Zinc background
            doc.rect(0, 0, 210, 36, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text("LAPORAN RIWAYAT PENJUALAN", 14, 18);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(212, 212, 216);
            doc.text("KASIR POS • Sistem Pencatatan Transaksi Penjualan", 14, 25);

            const exportDate = new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
            const exportTime = new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
            });
            doc.text(`Waktu Cetak: ${exportDate}, ${exportTime} WIB`, 210 - 14, 25, { align: "right" });

            // 2. Ringkasan Eksekutif (Summary Box)
            doc.setFillColor(248, 250, 252); // Slate-50
            doc.setDrawColor(226, 232, 240); // Slate-200
            doc.roundedRect(14, 42, 182, 22, 3, 3, "FD");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139); // Slate-500
            doc.text("TOTAL TRANSAKSI", 22, 50);
            doc.text("MENU TERLARIS", 82, 50);
            doc.text("TOTAL OMSET KESELURUHAN", 142, 50);

            doc.setFontSize(12);
            doc.setTextColor(15, 23, 42); // Slate-900
            doc.text(`${totalTransaksi} Checkout`, 22, 58);
            
            doc.setFontSize(10);
            const truncatedTop = topProduct[0].length > 18 ? topProduct[0].substring(0, 18) + "..." : topProduct[0];
            doc.text(`${truncatedTop} (${topProduct[1]}x)`, 82, 58);

            doc.setFontSize(12);
            doc.setTextColor(234, 88, 12); // Orange-600
            doc.text(`Rp ${totalOmzet.toLocaleString("id-ID")}`, 142, 58);

            // 3. Persiapkan Data Tabel
            const tableRows = transactions.map((t, index) => {
                const dateObj = new Date(t.created_at);
                const waktu = !isNaN(dateObj)
                    ? dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
                      " " +
                      dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                    : "-";

                const itemsText = t.details && t.details.length > 0
                    ? t.details.map(d => `• ${d.product_name} (x${d.qty})`).join("\n")
                    : "-";

                return [
                    (index + 1).toString(),
                    t.reference_no || "-",
                    waktu,
                    itemsText,
                    `Rp ${Number(t.total_price || 0).toLocaleString("id-ID")}`
                ];
            });

            // 4. Render Tabel Otomatis dengan Pagination Bersih
            autoTable(doc, {
                startY: 70,
                head: [["No", "No. Referensi", "Waktu Transaksi", "Daftar Menu & Kuantitas", "Total Tagihan"]],
                body: tableRows,
                theme: "striped",
                headStyles: {
                    fillColor: [249, 115, 22], // Orange-500
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    fontSize: 9,
                    halign: "left"
                },
                styles: {
                    font: "helvetica",
                    fontSize: 8,
                    textColor: [51, 65, 85],
                    cellPadding: 3.5,
                    valign: "middle"
                },
                columnStyles: {
                    0: { halign: "center", cellWidth: 14 },
                    1: { fontStyle: "bold", cellWidth: 32 },
                    2: { cellWidth: 34 },
                    3: { cellWidth: 68 },
                    4: { halign: "right", fontStyle: "bold", textColor: [194, 65, 12], cellWidth: 34 }
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                margin: { left: 14, right: 14, bottom: 20 },
                didDrawPage: (data) => {
                    // Footer di tiap halaman
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(148, 163, 184);
                    doc.text(
                        `Dokumen ini dibuat otomatis oleh Sistem Kasir • Halaman ${data.pageNumber} dari ${pageCount}`,
                        105,
                        290,
                        { align: "center" }
                    );
                }
            });

            const fileName = `Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error("Gagal export PDF:", error);
            alert("Terjadi kesalahan saat memproses file PDF!");
        } finally {
            setIsExporting(false);
        }
    };

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
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Riwayat Penjualan Terbaru</h3>
                        <p className="text-xs text-slate-400">Daftar rekapan transaksi pesanan pembeli</p>
                    </div>

                    {/* TOMBOL CETAK PDF DI SEBELAH KANAN UJUNG */}
                    <button
                        onClick={exportToPDF}
                        disabled={isExporting || transactions.length === 0}
                        className="self-start sm:self-auto px-4 py-2 bg-zinc-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Download Laporan Penjualan (PDF)"
                    >
                        <Download size={15} />
                        <span>{isExporting ? "Menyiapkan PDF..." : "Cetak PDF"}</span>
                    </button>
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
