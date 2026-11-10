import React, { useState } from "react";
import { Plus, Trash2, Edit2, X, Check, Tags, FolderTree } from "lucide-react";
import axios from "axios";

export default function CategoryList({
    loading,
    categories,
    products,
    fetchData
}) {
    const [catName, setCatName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addCategory = async e => {
        e.preventDefault();
        if (!catName.trim()) return;
        setIsSubmitting(true);
        try {
            await axios.post("http://127.0.0.1:8000/api/categories", {
                name: catName.trim()
            });
            setCatName("");
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Gagal menambahkan kategori!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveEdit = async () => {
        if (!editName.trim()) return;
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/categories/${editingId}`,
                { name: editName.trim() }
            );
            setEditingId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Gagal mengubah kategori!");
        }
    };

    const deleteCategory = async id => {
        const productCount = products.filter(p => p.category_id === id).length;
        const msg = productCount > 0 
            ? `Kategori ini memiliki ${productCount} produk. Apakah yakin ingin menghapusnya?`
            : "Hapus kategori ini?";
            
        if (window.confirm(msg)) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
                fetchData();
            } catch (error) {
                console.error(error);
                alert("Gagal menghapus kategori!");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header info */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        Kelola Kategori Menu
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Kelompokkan sajian makanan dan minuman agar mudah dicari kasir
                    </p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60 self-start sm:self-auto">
                    Total: <span className="text-orange-600 font-extrabold">{categories.length} Kategori</span>
                </div>
            </div>

            {/* Input Form Tambah Kategori */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <form onSubmit={addCategory} className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Tags className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Ketik nama kategori baru (contoh: Makanan Utama, Minuman Dingin)..."
                            value={catName}
                            onChange={e => setCatName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        <span>Tambah Kategori</span>
                    </button>
                </form>
            </div>

            {/* Grid List Kategori */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <FolderTree size={16} className="text-orange-600" />
                        <span>Kategori Tersedia</span>
                    </h3>
                </div>

                <div className="p-4 sm:p-6">
                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="custom-loader mx-auto mb-2"></div>
                            <p className="text-xs text-slate-400">Memuat kategori...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="py-10 text-center text-xs text-slate-400">
                            Belum ada kategori yang ditambahkan. Buat kategori pertama di atas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {categories.map(cat => {
                                const count = products.filter(p => p.category_id === cat.id).length;
                                const isEditingThis = editingId === cat.id;

                                return (
                                    <div
                                        key={cat.id}
                                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                            isEditingThis 
                                                ? "border-orange-500 bg-orange-50/30" 
                                                : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                                        }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            {isEditingThis ? (
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={e => setEditName(e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-white border border-orange-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800 truncate">
                                                        {cat.name}
                                                    </h4>
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        {count} Produk Terdaftar
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {isEditingThis ? (
                                                <>
                                                    <button
                                                        onClick={saveEdit}
                                                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-xs"
                                                        title="Simpan Perubahan"
                                                    >
                                                        <Check size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-all"
                                                        title="Batal"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(cat.id);
                                                            setEditName(cat.name);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                                        title="Ubah Nama"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCategory(cat.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Hapus Kategori"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
