import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Navigate, useLocation, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import ProductCard from "./components/ProductCard";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import Transaction from "./components/Transaction";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
    const [transactions, setTransactions] = useState([]);
    const [cart, setCart] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Fungsi Ambil Data dari Laravel
    const fetchData = async () => {
        setLoading(true);
        try {
            const [resProd, resCat, resTrx] = await Promise.all([
                axios.get(`${API_URL}/products`),
                axios.get(`${API_URL}/categories`),
                axios.get(`${API_URL}/transactions`)
            ]);

            setProducts(resProd.data.data || []);
            setCategories(resCat.data.data || []);
            setTransactions(resTrx.data.data || []);
            setRevenue(resTrx.data.total_revenue || 0);
        } catch (error) {
            console.error("Gagal ambil data!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addToCart = product => {
        setCart(prev => {
            const isExist = prev.find(item => item.id === product.id);

            if (isExist) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = productId => {
        setCart(prevCart => {
            // Cari barangnya
            const existingItem = prevCart.find(item => item.id === productId);

            if (existingItem.qty > 1) {
                // Kalau qty lebih dari 1, kurangi 1
                return prevCart.map(item =>
                    item.id === productId
                        ? { ...item, qty: item.qty - 1 }
                        : item
                );
            } else {
                // Kalau qty tinggal 1, tendang dari keranjang
                return prevCart.filter(item => item.id !== productId);
            }
        });
    };

    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("token");
        if (!token) return <Navigate to="/" replace />;
        return children;
    };

    const PublicRoute = ({ children }) => {
        const token = localStorage.getItem("token");
        if (token) return <Navigate to="/dashboard" replace />;
        return children;
    };

    const isLoginPage = location.pathname === "/";

    return (
        <div className="body min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {!isLoginPage && <Sidebar />}
            <main className={`flex-1 transition-all ${!isLoginPage ? "lg:ml-64 p-4 sm:p-6 lg:p-8" : ""}`}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <ProductCard
                                    loading={loading}
                                    setLoading={setLoading}
                                    products={products}
                                    categories={categories}
                                    transactions={transactions}
                                    setTransactions={setTransactions}
                                    cart={cart}
                                    setCart={setCart}
                                    addToCart={addToCart}
                                    removeFromCart={removeFromCart}
                                    revenue={revenue}
                                    setRevenue={setRevenue}
                                    fetchData={fetchData}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/daftar-produk"
                        element={
                            <ProtectedRoute>
                                <ProductList
                                    loading={loading}
                                    setLoading={setLoading}
                                    products={products}
                                    setProducts={setProducts}
                                    categories={categories}
                                    fetchData={fetchData}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/daftar-kategori"
                        element={
                            <ProtectedRoute>
                                <CategoryList
                                    loading={loading}
                                    setLoading={setLoading}
                                    categories={categories}
                                    products={products}
                                    fetchData={fetchData}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/riwayat-transaksi"
                        element={
                            <ProtectedRoute>
                                <Transaction
                                    loading={loading}
                                    setLoading={setLoading}
                                    transactions={transactions}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
