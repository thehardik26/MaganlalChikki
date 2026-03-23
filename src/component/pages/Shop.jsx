import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import getProducts, { getCategory } from "../utils/getProducts";
import { addToCart } from "../redux/Store/slice/cartslice";
import { addFav } from "../redux/Store/slice/favslice";
import PageHeader from "../global/PageHeader";

const Shop = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedId, setSelectedId] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState(2000);
    const [sortMethod, setSortMethod] = useState("default");

    const { data: categories, isFetching: catLoading } = useQuery({
        queryKey: ["caty"],
        queryFn: getCategory,
    });

    const { data: products, isFetching: prodLoading } = useQuery({
        queryKey: ["products", selectedId],
        queryFn: () => getProducts(selectedId),
        enabled: !!selectedId,
    });

    const filteredAndSortedProducts = useMemo(() => {
        if (!products || !Array.isArray(products)) return [];

        let result = products.filter((item) => {
            const name = item?.product_name?.toLowerCase() || "";
            const price = parseFloat(item?.product_price) || 0;
            const matchesSearch = name.includes(searchTerm.toLowerCase());
            const matchesPrice = price <= parseFloat(priceRange);
            return matchesSearch && matchesPrice;
        });

        const sorted = [...result];
        if (sortMethod === "lowToHigh") {
            sorted.sort((a, b) => parseFloat(a.product_price) - parseFloat(b.product_price));
        } else if (sortMethod === "highToLow") {
            sorted.sort((a, b) => parseFloat(b.product_price) - parseFloat(a.product_price));
        } else if (sortMethod === "alphabetical") {
            sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
        }

        return sorted;
    }, [products, sortMethod, searchTerm, priceRange]);

    const resetFilters = () => {
        setSearchTerm("");
        setPriceRange(2000);
        setSortMethod("default");
    };

    if (catLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <PageHeader title="Shop" />

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                <aside className="w-full lg:w-64 shrink-0 space-y-10">
                    <section>
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                            <FaSearch className="text-amber-500" size={12}/> Search
                        </h3>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Product name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                            />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3 mb-6">Categories</h3>
                        <ul className="space-y-4">
                            {categories?.map((cat) => (
                                <li
                                    key={cat.id}
                                    onClick={() => setSelectedId(cat.id)}
                                    className={`text-[13px] cursor-pointer transition-all duration-300 uppercase tracking-tight flex items-center gap-2 ${
                                        selectedId === cat.id 
                                        ? "text-amber-600 font-bold translate-x-2" 
                                        : "text-gray-500 hover:text-amber-500"
                                    }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full bg-amber-500 ${selectedId === cat.id ? 'opacity-100' : 'opacity-0'}`}></span>
                                    {cat.category_name}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3 mb-6">By Price</h3>
                        <input 
                            type="range" min="50" max="2000" step="50"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full accent-amber-500 mb-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                            <span>₹50</span>
                            <span className="text-amber-600">UP TO ₹{priceRange}</span>
                        </div>
                    </section>

                    <button 
                        onClick={resetFilters}
                        className="w-full bg-white border border-amber-200 text-amber-600 text-[11px] font-black uppercase py-3 rounded-xl tracking-widest hover:bg-amber-50 transition-colors shadow-sm"
                    >
                        Reset All Filters
                    </button>
                </aside>

                <main className="flex-1">
                    <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b border-gray-100 gap-4">
                        <div className="flex gap-2 items-center">
                            <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                            <h2 className="text-2xl font-serif text-gray-800 uppercase tracking-widest italic">Shop</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By:</label>
                            <select 
                                value={sortMethod}
                                onChange={(e) => setSortMethod(e.target.value)}
                                className="text-[10px] font-black text-gray-700 uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer hover:text-amber-500 outline-none"
                            >
                                <option value="default">Newest First</option>
                                <option value="lowToHigh">Price: Low to High</option>
                                <option value="highToLow">Price: High to Low</option>
                                <option value="alphabetical">Name: A - Z</option>
                            </select>
                        </div>
                    </header>

                    {prodLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="animate-pulse bg-amber-50/50 aspect-square rounded-3xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                            <AnimatePresence mode="popLayout">
                                {filteredAndSortedProducts.length > 0 ? (
                                    filteredAndSortedProducts.map((product) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={product.id}
                                            className="group cursor-pointer"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            <div className="aspect-square bg-white rounded-4xl overflow-hidden relative mb-5 shadow-sm border border-gray-50 p-2">
                                                <img
                                                    src={product.product_image}
                                                    alt={product.product_name}
                                                    className="w-full h-full object-cover rounded-[1.8rem] transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-amber-900/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="bg-white p-3 rounded-full shadow-xl text-gray-700 hover:bg-amber-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"><FaEye size={14}/></button>
                                                    <button onClick={(e) => { e.stopPropagation(); dispatch(addFav(product)); }} className="bg-white p-3 rounded-full shadow-xl text-gray-700 hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"><FaHeart size={14}/></button>
                                                    <button onClick={(e) => { e.stopPropagation(); dispatch(addToCart(product)); }} className="bg-white p-3 rounded-full shadow-xl text-gray-700 hover:bg-emerald-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-100"><FaShoppingCart size={14}/></button>
                                                </div>
                                            </div>
                                            <h4 className="text-[13px] text-gray-800 font-bold mb-1 line-clamp-1 group-hover:text-amber-600 transition-colors uppercase tracking-tight px-1">
                                                {product.product_name}
                                            </h4>
                                            <p className="text-amber-600 font-black text-lg px-1">₹{product.product_price}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-gray-400 italic font-serif text-lg">No products found matching your filters.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;