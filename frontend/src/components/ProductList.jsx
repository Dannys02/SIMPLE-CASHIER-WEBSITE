import React, { useState } from "react";
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Image as ImageIcon, 
    X, 
    Check, 
    AlertCircle, 
    ChevronLeft, 
    ChevronRight,
    Search
} from "lucide-react";
import axios from "axios";

export default function ProductList({
    loading,
    products,
    categories,
    fetchData,
    itemsPerPage = 6
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTable, setSearchTable] = useState("");
    const [form, setForm] = useState({
        id: null,
        name: "",
        category_id: "",
        price: ""
    });

    const [successModal, setSuccessModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const STORAGE_URL = "http://127.0.0.1:8000/storage/";

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append("name", form.name);
        data.append("category_id", form.category_id);
        data.append("price", form.price);

        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            if (isEdit) {
                data.append("_method", "PUT");
                await axios.post(
                    `http://127.0.0.1:8000/api/products/${form.id}`,
                    data,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                setModalMessage("Produk Berhasil Diperbarui!");
            } else {
                await axios.post("http://127.0.0.1:8000/api/products", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setModalMessage("Produk Berhasil Ditambahkan!");
            }

            setSuccessModal(true);
            fetchData();
            resetForm();
            setTimeout(() => setSuccessModal(false), 3000);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Gagal Memproses Data Produk!";
            setModalMessage(errorMessage);
            setErrorModal(true);
            setTimeout(() => setErrorModal(false), 3500);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setForm({ id: null, name: "", category_id: "", price: "" });
        setImageFile(null);
        setPreviewUrl(null);
        setIsEdit(false);
    };

    const editProduct = p => {
        setForm({
            id: p.id,
            name: p.name,
            category_id: p.category_id,
            price: p.price
        });
        setPreviewUrl(p.image ? (p.image.startsWith("http") ? p.image : STORAGE_URL + p.image) : null);
        setIsEdit(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteProduct = async id => {
        if (window.confirm("Hapus produk ini dari katalog?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
                setModalMessage("Produk Berhasil Dihapus!");
                setSuccessModal(true);
                fetchData();
                setTimeout(() => setSuccessModal(false), 2500);
            } catch (error) {
                setModalMessage("Gagal Menghapus Produk!");
                setErrorModal(true);
                setTimeout(() => setErrorModal(false), 2500);
            }
        }
    };

    // Filter daftar tabel
    const filteredTableProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTable.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTable.toLowerCase())
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredTableProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTableProducts.length / itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Header info */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                        Manajemen Produk
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Kelola katalog menu, harga jual, dan foto sajian makanan & minuman
                    </p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60 self-start sm:self-auto">
                    Total: <span className="text-orange-600 font-extrabold">{products.length} Menu</span>
                </div>
            </div>

            {/* Form Section Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        {isEdit ? (
                            <span className="flex items-center gap-2 text-amber-600">
                                <Edit2 size={18} /> Edit Data Produk
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-orange-600">
                                <Plus size={18} /> Tambah Menu Baru
                            </span>
                        )}
                    </h2>
                    {isEdit && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                        >
                            <X size={14} /> Batal Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Nama Produk */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                Nama Menu Produk *
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Paket Geprek Sambal Bawang"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                Kategori *
                            </label>
                            <select
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700"
                                value={form.category_id}
                                onChange={e => setForm({ ...form, category_id: e.target.value })}
                                required
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Harga */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                                Harga Jual (Rp) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Contoh: 15000"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Upload Foto Preview */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                            Foto Sajian (Maks 2MB)
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-full sm:w-64 h-36 relative border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/20 transition-all overflow-hidden group">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        alt="Preview"
                                    />
                                ) : (
                                    <div className="text-center p-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-orange-100 group-hover:text-orange-600 text-slate-400 flex items-center justify-center mx-auto mb-1.5 transition-colors">
                                            <ImageIcon size={20} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 block">Klik untuk unggah</span>
                                        <span className="text-[10px] text-slate-400">PNG, JPG, WebP</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>

                            <div className="text-xs text-slate-400 flex-1 space-y-1">
                                <p className="font-semibold text-slate-600">Tips Gambar:</p>
                                <p>• Gunakan foto berorientasi kotak (1:1) dengan pencahayaan jelas.</p>
                                <p>• Gambar akan otomatis dioptimasi untuk memuat menu lebih cepat saat kasir beroperasi.</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Submit */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        {isEdit && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Batal
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-600/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">Menyimpan...</span>
                            ) : (
                                <>
                                    {isEdit ? <Edit2 size={16} /> : <Plus size={16} />}
                                    <span>{isEdit ? "Perbarui Produk" : "Simpan Produk Baru"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Daftar Menu Aktif</h3>
                        <p className="text-xs text-slate-400">Total {filteredTableProducts.length} produk ditemukan</p>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Cari menu dalam tabel..."
                            value={searchTable}
                            onChange={e => {
                                setSearchTable(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="py-3 px-4">Menu</th>
                                <th className="py-3 px-4">Kategori</th>
                                <th className="py-3 px-4">Harga Jual</th>
                                <th className="py-3 px-4 text-center">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <div className="custom-loader mx-auto mb-2"></div>
                                        <p className="text-xs text-slate-400">Memuat data produk...</p>
                                    </td>
                                </tr>
                            ) : currentProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-xs text-slate-400">
                                        Tidak ada produk yang cocok dengan pencarian.
                                    </td>
                                </tr>
                            ) : (
                                currentProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        p.image
                                                            ? (p.image.startsWith("http") ? p.image : STORAGE_URL + p.image)
                                                            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60"
                                                    }
                                                    className="w-11 h-11 rounded-xl object-cover border border-slate-200/80 shrink-0"
                                                    alt={p.name}
                                                />
                                                <div>
                                                    <span className="font-bold text-slate-800 text-xs sm:text-sm block">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        ID: #{p.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                                                {p.category?.name || "Tanpa Kategori"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-extrabold text-orange-600 text-xs sm:text-sm">
                                            Rp {p.price.toLocaleString("id-ID")}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => editProduct(p)}
                                                    className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                                    title="Edit Data"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(p.id)}
                                                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Hapus Produk"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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

            {/* MODAL NOTIFIKASI TOAST */}
            <div
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
                    successModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
                }`}
            >
                <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold">{modalMessage}</span>
                </div>
            </div>

            <div
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
                    errorModal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
                }`}
            >
                <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
                        <AlertCircle size={18} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold">{modalMessage}</span>
                </div>
            </div>
        </div>
    );
}
