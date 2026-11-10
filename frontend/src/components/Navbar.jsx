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

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const userName = localStorage.getItem("userName") || "Kasir Utama";

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://127.0.0.1:8000/api/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout API error", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            navigate("/"); 
        }
    };

    const menuItems = [
        { name: "POS Kasir", to: "/dashboard", icon: <LayoutDashboard size={19} /> },
        { name: "Daftar Produk", to: "/daftar-produk", icon: <ShoppingBag size={19} /> },
        { name: "Kategori", to: "/daftar-kategori", icon: <Tags size={19} /> },
        { name: "Riwayat Penjualan", to: "/riwayat-transaksi", icon: <History size={19} /> }
    ];

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Section */}
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                            <UtensilsCrossed className="text-white" size={20} strokeWidth={2.4} />
                        </div>
                        <div>
                            <span className="text-lg font-extrabold tracking-tight text-slate-800 flex items-center gap-1.5">
                                Kasir<span className="text-orange-600">POS</span>
                            </span>
                            <span className="hidden sm:block text-[11px] font-medium text-slate-400 -mt-1 tracking-wide">
                                Cepat • Rapi • Akurat
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu Navigation */}
                    <nav className="hidden md:flex items-center space-x-1.5">
                        {menuItems.map(item => {
                            const isActive = location.pathname === item.to;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${isActive 
                                        ? "text-orange-600 bg-orange-50/80 shadow-sm shadow-orange-500/5 ring-1 ring-orange-200/60" 
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"}`}
                                >
                                    <span className={isActive ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600"}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            );
                        })}

                        {/* User Info & Logout Button */}
                        <div className="ml-3 pl-3 border-l border-slate-200 flex items-center gap-3">
                            <div className="hidden lg:flex flex-col text-right">
                                <span className="text-xs font-bold text-slate-700 leading-tight">{userName}</span>
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Online
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200/80 hover:border-rose-200"
                                title="Keluar dari akun"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu Hamburger Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200/80"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <div 
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-200/80 ${
                    isOpen ? "max-h-80 opacity-100 shadow-xl" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 py-3 space-y-1.5">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                onClick={() => setIsOpen(false)}
                                key={item.name}
                                to={item.to}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? "text-orange-600 bg-orange-50 font-bold"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <span className={isActive ? "text-orange-600" : "text-slate-400"}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="pt-2 border-t border-slate-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                        >
                            <LogOut size={18} />
                            Logout ({userName})
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
