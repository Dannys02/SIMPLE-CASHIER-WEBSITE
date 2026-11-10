import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async e => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                {
                    email,
                    password
                }
            );

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                if (response.data.user?.name) {
                    localStorage.setItem("userName", response.data.user.name);
                }
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            setError("Email atau password yang Anda masukkan salah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-10 relative overflow-hidden">
                {/* Accent top gradient bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

                {/* Logo & Heading */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
                        <UtensilsCrossed className="text-white" size={26} strokeWidth={2.4} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                        Kasir<span className="text-orange-600">POS</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Sistem Kasir Penjualan Cepat & Efisien
                    </p>
                </div>

                {error && (
                    <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/60 text-xs font-semibold text-rose-600 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                            Email Akun Kasir
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                                placeholder="nama@kasir.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                            Kata Sandi (Password)
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 text-sm mt-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Memeriksa Kredensial...</span>
                        ) : (
                            <>
                                <span>Masuk ke Kasir</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-xs">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Terproteksi Sanctum REST API</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
