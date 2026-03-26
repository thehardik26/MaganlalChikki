import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaShoppingCart,
    FaEye,
    FaFilter,
    FaRedo,
    FaHeart,
    FaChevronRight
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import getProducts, { getCategory } from "../utils/getProducts";
import { addToCart } from "../redux/Store/slice/cartslice";
import { addFav } from "../redux/Store/slice/favslice";
import PageHeader from "../global/PageHeader";

const BASE_URL = "http://localhost:5000";

const Shop = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { search } = useLocation();

    const urlSearchTerm = new URLSearchParams(search).get("search") || "";

    const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
    const [selectedCatId, setSelectedCatId] = useState(null);
    const [priceRange, setPriceRange] = useState(2000);
    const [sortMethod, setSortMethod] = useState("default");

    useEffect(() => {
        setSearchTerm(urlSearchTerm);
    }, [urlSearchTerm]);

    const { data: categories = [], isLoading: catLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategory,
    });

    const productsQuery = useQueries({
        queries: categories?.length
            ? categories.map((cat) => ({
                queryKey: ["products", cat.id],
                queryFn: async () => {
                    const res = await getProducts(cat.id);
                    if (!res) return [];
                    return res.map((item) => ({
                        ...item,
                        id: item.id || item._id,
                        display_name: item.product_title || item.product_name || item.title || "",
                        display_price: Number(item.product_price || item.price || 0),
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
        return allProducts
            .filter((product) => {
                const name = product.display_name || "";
                const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesPrice = Number(product.display_price) <= priceRange;
                const matchesCategory = selectedCatId ? String(product.category_id) === String(selectedCatId) : true;
                return matchesSearch && matchesPrice && matchesCategory;
            })
            .sort((a, b) => {
                if (sortMethod === "lowToHigh") return a.display_price - b.display_price;
                if (sortMethod === "highToLow") return b.display_price - a.display_price;
                if (sortMethod === "alphabetical") return a.display_name.localeCompare(b.display_name);
                return 0;
            });
    }, [allProducts, searchTerm, priceRange, selectedCatId, sortMethod]);

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCatId(null);
        setPriceRange(2000);
        setSortMethod("default");
        navigate("/shop");
    };

    if (loading && allProducts.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
        <PageHeader title="Shop" />
        <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-12 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
                <aside className="w-full lg:w-72 shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest text-xs">
                                <FaFilter className="text-amber-500" /> Filters
                            </h3>
                            <button onClick={resetFilters} className="text-amber-600 text-[10px] font-black uppercase flex items-center gap-1 hover:opacity-70">
                                <FaRedo /> Reset
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Search</h4>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 rounded-xl p-3 text-sm border-none focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                                    placeholder="Find your favorite..."
                                />
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Collections</h4>
                                <ul className="space-y-3">
                                    <li 
                                        onClick={() => setSelectedCatId(null)}
                                        className={`cursor-pointer text-sm flex items-center justify-between group ${!selectedCatId ? 'text-amber-600 font-bold' : 'text-gray-500'}`}
                                    >
                                        All Products
                                        <FaChevronRight className={`text-[8px] transition-transform ${!selectedCatId ? 'translate-x-0' : '-translate-x-2 opacity-0'}`} />
                                    </li>
                                    {categories.map((cat) => (
                                        <li 
                                            key={cat.id} 
                                            onClick={() => setSelectedCatId(cat.id)}
                                            className={`cursor-pointer text-sm flex items-center justify-between group transition-all ${String(selectedCatId) === String(cat.id) ? 'text-amber-600 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                                        >
                                            {cat.category_name || cat.cat_name}
                                            <FaChevronRight className={`text-[8px] transition-transform ${String(selectedCatId) === String(cat.id) ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <div className="flex justify-between mb-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Price Range</h4>
                                    <span className="text-xs font-bold text-amber-600">₹{priceRange}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="2000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Sort By</h4>
                                <select 
                                    value={sortMethod}
                                    onChange={(e) => setSortMethod(e.target.value)}
                                    className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none cursor-pointer"
                                >
                                    <option value="default">Default Sorting</option>
                                    <option value="lowToHigh">Price: Low to High</option>
                                    <option value="highToLow">Price: High to Low</option>
                                    <option value="alphabetical">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => {
                                let images = product.product_images || product.product_image || product.images || [];
                                if (typeof images === "string") images = [images];
                                const imageUrl = images[0]?.startsWith("http") ? images[0] : images[0] ? BASE_URL + images[0] : "https://via.placeholder.com/400";

                                return (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex flex-col group p-3 bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-[2rem] transition-all duration-500 relative">
                                            <Link to={`/product/${product.category_id}/${product.id}`}>
                                                <div className="relative overflow-hidden mb-4 rounded-[1.5rem] bg-gray-50 aspect-square flex items-center justify-center">
                                                    <img
                                                        src={imageUrl}
                                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-700"
                                                        alt={product.display_name}
                                                    />
                                                </div>
                                            </Link>

                                            <div className="absolute top-6 right-6 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); navigate(`/product/${product.category_id}/${product.id}`); }}
                                                    className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-gray-800 hover:bg-amber-500 hover:text-white transition-all"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); dispatch(addFav(product)); }}
                                                    className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-gray-800 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <FaHeart size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); dispatch(addToCart(product)); }}
                                                    className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-gray-800 hover:bg-gray-900 hover:text-white transition-all"
                                                >
                                                    <FaShoppingCart size={14} />
                                                </button>
                                            </div>

                                            <div className="px-2 pb-2">
                                                <h3 className="text-xs font-bold text-gray-800 truncate mb-1">
                                                    {product.display_name}
                                                </h3>
                                                <p className="text-amber-600 font-black text-sm">
                                                    ₹{product.display_price}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center py-32">
                                <div className="text-gray-300 mb-4 flex justify-center"><FaFilter size={40} /></div>
                                <h3 className="text-gray-400 font-black uppercase tracking-widest text-xs">No products found</h3>
                                <button onClick={resetFilters} className="mt-4 text-amber-600 text-[10px] font-black uppercase underline decoration-2 underline-offset-4">Clear all filters</button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
        </>
    );
};

export default Shop;