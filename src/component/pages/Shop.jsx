import React, { useState, useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaEye, FaSearch, FaFilter, FaRedo, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import getProducts, { getCategory } from "../utils/getProducts";
import { addToCart } from "../redux/Store/slice/cartslice";
import { addFav } from "../redux/Store/slice/favslice";

const BASE_URL = "http://localhost:5000";

const Shop = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCatId, setSelectedCatId] = useState(null);
    const [priceRange, setPriceRange] = useState(2000);
    const [sortMethod, setSortMethod] = useState("default");

    const { data: categories = [], isLoading: catLoading } = useQuery({
        queryKey: ["caty"],
        queryFn: getCategory,
    });

    const productsQuery = useQueries({
        queries: categories?.length
            ? categories.map((cat) => ({
                queryKey: ["products", cat.id],
                queryFn: async () => {
                    const res = await getProducts(cat.id);
                    return res.map((item) => ({
                        ...item,
                        category_id: cat.id,
                    }));
                },
                enabled: !!cat.id,
            }))
            : [],
        combine: (results) => ({
            data: results.map((r) => r.data ?? []).flat(),
            isFetching: results.some((r) => r.isFetching),
        }),
    });

    const allProducts = productsQuery.data || [];
    const loading = catLoading || productsQuery.isFetching;

    const filteredProducts = useMemo(() => {
        let result = allProducts.filter((product) => {
            const name = (product.product_title || product.product_name || product.title || "").toLowerCase();
            const price = parseFloat(product.product_price || product.price || 0);

            const matchesSearch = name.includes(searchTerm.toLowerCase());
            const matchesPrice = price <= priceRange;
            const matchesCategory = selectedCatId ? product.category_id === selectedCatId : true;

            return matchesSearch && matchesPrice && matchesCategory;
        });

        const sorted = [...result];
        if (sortMethod === "lowToHigh") sorted.sort((a, b) => parseFloat(a.product_price || a.price) - parseFloat(b.product_price || b.price));
        if (sortMethod === "highToLow") sorted.sort((a, b) => parseFloat(b.product_price || b.price) - parseFloat(a.product_price || a.price));
        if (sortMethod === "alphabetical") sorted.sort((a, b) => (a.product_name || a.title || "").localeCompare(b.product_name || b.title || ""));

        return sorted;
    }, [allProducts, searchTerm, priceRange, selectedCatId, sortMethod]);

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCatId(null);
        setPriceRange(2000);
        setSortMethod("default");
    };

    if (loading && allProducts.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
                <aside className="w-full lg:w-72 shrink-0 space-y-8">
                    <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
                                <FaFilter className="text-amber-500" size={12} /> Filters
                            </h3>
                            <button onClick={resetFilters} className="text-amber-600 text-[10px] font-bold uppercase hover:underline flex items-center gap-1">
                                <FaRedo size={8} /> Reset
                            </button>
                        </div>

                        <div className="mb-8">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Search</label>
                            <div className="relative">
                                <input
                                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Categories</label>
                            <ul className="space-y-3">
                                <li
                                    onClick={() => setSelectedCatId(null)}
                                    className={`text-[12px] cursor-pointer uppercase font-bold tracking-tight transition-colors ${selectedCatId ? "text-gray-500 hover:text-amber-500" : "text-amber-600 font-black"}`}
                                >
                                    All Products
                                </li>
                                {categories.map(cat => (
                                    <li
                                        key={cat.id}
                                        onClick={() => setSelectedCatId(cat.id)}
                                        className={`text-[12px] cursor-pointer uppercase font-bold tracking-tight transition-colors ${selectedCatId === cat.id ? "text-amber-600 translate-x-1 font-black" : "text-gray-500 hover:text-amber-500"}`}
                                    >
                                        {cat.category_name || cat.cat_name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Max Price: ₹{priceRange}</label>
                            <input
                                type="range" min="50" max="2000" step="50"
                                value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full accent-amber-500 cursor-pointer"
                            />
                        </div>
                    </div>
                </aside>

                <main className="flex-1">
                    <header className="mb-10 flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 pb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-1.5 bg-amber-500 rounded-full"></div>
                            <h2 className="text-2xl font-serif italic text-gray-800 uppercase tracking-widest">
                                Collection <span className="text-gray-300 font-sans text-sm not-italic ml-2">({filteredProducts.length})</span>
                            </h2>
                        </div>

                        <select
                            value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}
                            className="bg-white border border-gray-100 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer focus:ring-1 focus:ring-amber-500 shadow-sm"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="lowToHigh">Price: Low to High</option>
                            <option value="highToLow">Price: High to Low</option>
                            <option value="alphabetical">Name: A-Z</option>
                        </select>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => {
                                const name = product.product_title || product.product_name || product.title || "No Name";
                                const price = product.product_price || product.price || 0;
                                let images = product.product_images || product.product_image || product.images || [];
                                if (typeof images === "string") images = [images];
                                const imageUrl = images[0]?.startsWith("http") ? images[0] : images[0] ? BASE_URL + images[0] : "https://via.placeholder.com/400";

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={product.id || product._id}
                                        className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        <div className="relative aspect-square overflow-hidden rounded-4xl bg-amber-50/20 mb-5">
                                            <img src={imageUrl} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-amber-900/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="rounded-full bg-white p-3 text-gray-700 shadow-lg hover:bg-amber-500 hover:text-white transition-all"><FaEye size={14} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); dispatch(addFav(product)); }} className="rounded-full bg-white p-3 text-gray-700 shadow-lg hover:bg-red-500 hover:text-white transition-all"><FaHeart size={14} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart(product)); }} className="rounded-full bg-white p-3 text-gray-700 shadow-lg hover:bg-emerald-500 hover:text-white transition-all"><FaShoppingCart size={14} /></button>
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <h4 className="text-[13px] font-bold uppercase tracking-tight text-gray-800 line-clamp-1 group-hover:text-amber-600 transition-colors mb-1">{name}</h4>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-black text-amber-600">₹{price}</p>
                                                <span className="text-[9px] font-black uppercase text-gray-300 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">Details +</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Shop;