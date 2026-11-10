import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    History, 
    Tags, 
    Menu, 
    X, 
    LogOut, 
    UtensilsCrossed 
} from "lucide-react";
import axios from "axios";

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://127.0.0.1:8000/api/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            navigate("/"); 
        }
    };

    const menuItems = [
        { name: "POS Kasir", to: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Daftar Produk", to: "/daftar-produk", icon: <ShoppingBag size={20} /> },
        { name: "Kategori Menu", to: "/daftar-kategori", icon: <Tags size={20} /> },
        { name: "Riwayat Penjualan", to: "/riwayat-transaksi", icon: <History size={20} /> }
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full justify-between">
            <div>
                {/* Brand Logo & Name */}
                <div className="p-6 border-b border-zinc-800/80 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/25 shrink-0">
                        <UtensilsCrossed className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                        <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                            Kasir<span className="text-orange-500">POS</span>
                        </span>
                        <span className="text-[11px] font-medium text-zinc-400 block -mt-0.5 tracking-wider">
                            Panel Kasir & Admin
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="px-3 py-6 space-y-1.5">
                    <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-2">
                        Menu Utama
                    </p>
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                key={item.name}
                                to={item.to}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 font-bold"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                                }`}
                            >
                                <span className={isActive ? "text-white" : "text-zinc-400"}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Section: Profile & Logout */}
            <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 transition-all"
                >
                    <LogOut size={16} />
                    <span>Keluar Sistem</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* TOP BAR FOR MOBILE DEVICES */}
            <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 h-16 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                        <UtensilsCrossed className="text-white" size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-base font-extrabold text-white">
                        Kasir<span className="text-orange-500">POS</span>
                    </span>
                </div>

                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl"
                    aria-label="Buka Menu"
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* MOBILE DRAWER OVERLAY */}
            {isMobileOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-50 transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* MOBILE DRAWER SIDEBAR */}
            <aside
                className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-zinc-950 z-50 transition-transform duration-300 shadow-2xl ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <NavContent />
            </aside>

            {/* DESKTOP FIXED SIDEBAR (Warna Hitam Gelap / Zinc 950) */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800/90 z-30 flex-col shadow-xl">
                <NavContent />
            </aside>
        </>
    );
}
