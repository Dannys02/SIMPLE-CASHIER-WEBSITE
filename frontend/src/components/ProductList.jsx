import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon, X } from "lucide-react";
import axios from "axios";

export default function ProductList({
    loading,
    products,
    categories,
    fetchData,
    itemsPerPage = 5
}) {
    const [currentPage, setCurrentPage] = useState(1);
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
    const [previewUrl, setPreviewUrl] = useState(null); // Untuk nampilin gambar yang dipilih
    const [isEdit, setIsEdit] = useState(false);

    const STORAGE_URL = "http://127.0.0.1:8000/storage/";

    // 1. Fungsi handle gambar & Preview
    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Buat URL sementara buat tampilan
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

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
                // Menggunakan POST karena membawa FormData (Laravel Spoofing)
                await axios.post(
                    `http://127.0.0.1:8000/api/products/${form.id}`,
                    data,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
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

            // Auto close modal setelah 3 detik
            setTimeout(() => setSuccessModal(false), 3000);
        } catch (error) {
            // Lihat di Inspect > Console > Network Tab
            console.error("Penyakitnya adalah:", error.response?.data);

            // Ambil pesan error dari Laravel kalau ada
            const errorMessage =
                error.response?.data?.message || "Gagal Memproses Data!";
            setModalMessage(errorMessage);
            setErrorModal(true);
            setTimeout(() => setErrorModal(false), 3000);
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
        // Kalau edit, kasih preview gambar yang lama dulu
        setPreviewUrl(p.image ? STORAGE_URL + p.image : null);
        setIsEdit(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteProduct = async id => {
        if (confirm("Hapus produk ini?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
                setModalMessage("Produk Berhasil Dihapus. Silakan refresh!");
                setSuccessModal(true);
                fetchData();
                setTimeout(() => setSuccessModal(false), 3000);
            } catch (error) {
                setModalMessage("Gagal Menghapus Produk!");
                setErrorModal(true);
                setTimeout(() => setErrorModal(false), 3000);
            }
        }
    };

    // --- LOGIKA PAGINATION ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="text-orange-600" />{" "}
                {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 mb-10 bg-gray-50 p-6 rounded-2xl"
            >
                <input
                    type="text"
                    placeholder="Nama Produk"
                    className="p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                />

                <select
                    className="p-3 rounded-xl border border-gray-200 outline-none"
                    value={form.category_id}
                    onChange={e =>
                        setForm({ ...form, category_id: e.target.value })
                    }
                    required
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Harga"
                    className="p-3 rounded-xl border border-gray-200"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                />

                {/* Input Gambar dengan Preview */}
                <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white transition-all p-2 overflow-hidden h-[300px]">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Preview"
                        />
                    ) : (
                        <>
                            <ImageIcon size={20} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400 mt-1">
                                Foto
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>

                <div className="w-full mt-1">
                    <p className="text-gray-500 italic text-center leading-tight">
                        * Gunakan gambar maksimal{" "}
                        <span className="text-red-600 font-bold">1 MB</span>{" "}
                        untuk performa terbaik.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="flex-1 p-3 bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all"
                    >
                        {isEdit ? <Edit2 size={18} /> : <Plus size={18} />}{" "}
                        {isEdit ? "Update" : "Simpan"}
                    </button>
                    {isEdit && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="p-3 bg-gray-200 text-gray-600 rounded-xl"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </form>

            {/* Tabel Produk */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-sm">
                            <th className="py-4 px-6 font-medium">Gambar</th>
                            <th className="py-4 px-6 font-medium">
                                Nama Produk
                            </th>
                            <th className="py-4 px-6 font-medium">Kategori</th>
                            <th className="py-4 px-6 font-medium">Harga</th>
                            <th className="py-4 px-6 font-medium text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-20">
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <div className="custom-loader"></div>
                                        <p className="text-gray-400">
                                            Memuat data...
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <td
                                colSpan="6"
                                className="text-gray-400 text-center py-6"
                            >
                                {" "}
                                Tidak ada data produk.
                            </td>
                        ) : (
                            currentProducts.map(p => (
                                <tr
                                    key={p.id}
                                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-all"
                                >
                                    <td className="py-4 px-6 gap-3">
                                        <img
                                            src={
                                                p.image
                                                    ? p.image.startsWith("http")
                                                        ? p.image
                                                        : STORAGE_URL + p.image
                                                    : "https://via.placeholder.com/50"
                                            }
                                            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                            alt={p.name}
                                        />
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-gray-700 gap-3">
                                        {p.name}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500">
                                        {p.category?.name || "No Category"}
                                    </td>
                                    <td className="py-4 px-6 text-orange-600 font-bold">
                                        Rp {p.price.toLocaleString("id-ID")}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => editProduct(p)}
                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteProduct(p.id)
                                                }
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

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

            {/* Modal Berhasil */}
            <div
                className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
                    successModal
                        ? "top-10 opacity-100 scale-100"
                        : "-top-20 opacity-0 scale-95 pointer-events-none"
                }`}
            >
                <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
                    <div className="bg-white/20 p-1 rounded-full animate-bounce">
                        <Plus
                            size={20}
                            strokeWidth={3}
                            className="rotate-45 rotate-0 transition-transform duration-500"
                        />
                    </div>
                    <span className="font-bold tracking-wide">
                        {modalMessage}
                    </span>
                </div>
            </div>

            {/* Modal Gagal */}
            <div
                className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
                    errorModal
                        ? "top-10 opacity-100 scale-100"
                        : "-top-20 opacity-0 scale-95 pointer-events-none"
                }`}
            >
                <div className="bg-rose-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-400">
                    <div className="bg-white/20 p-1 rounded-full">
                        <X size={20} strokeWidth={3} />
                    </div>
                    <span className="font-bold tracking-wide">
                        {modalMessage}
                    </span>
                </div>
            </div>
        </div>
    );
}
