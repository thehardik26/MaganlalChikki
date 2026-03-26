import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Store/slice/cartslice.js";
import { 
    FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, 
    FaStar, FaShieldAlt, FaTruck, FaLeaf, FaShareAlt 
} from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import RelatedProducts from "./RelatedProducts.jsx";

const BASE_URL = "https://appy.trycatchtech.com";

export default function ProductDetail() {
    const { catid, productid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productid]);

    const getProducts = async (catid) => {
        const res = await axios.get(
            `${BASE_URL}/v3/maganlalchikki/product_list?category_id=${catid}`
        );
        return res.data || [];
    };

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products", catid],
        queryFn: () => getProducts(catid),
        enabled: !!catid,
    });

    const product = products.find((p) => String(p.id) === String(productid));

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent"
                />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <h2 className="text-3xl font-serif italic text-gray-800 mb-4">Product escaped our kitchen!</h2>
                <button onClick={() => navigate("/shop")} className="text-amber-600 font-black uppercase text-xs tracking-widest border-b-2 border-amber-600 pb-1">
                    Back to Shop
                </button>
            </div>
        );
    }

    const images = Array.isArray(product.product_images || product.images || product.image) 
        ? (product.product_images || product.images || product.image) 
        : [product.product_images || product.product_images || product.image];

    const imageUrl = images[0]?.startsWith("http") ? images[0] : images[0] ? BASE_URL + images[0] : "https://via.placeholder.com/600";

    return (
        <div className="min-h-screen bg-[#fafaf9] selection:bg-amber-100 selection:text-amber-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <nav className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center gap-2 font-bold uppercase text-[11px] tracking-[0.2em] text-gray-500 hover:text-amber-600 transition-all"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white rounded-full border border-gray-100 shadow-sm text-gray-400 hover:text-amber-600 transition-all">
                            <FaShareAlt size={14} />
                        </button>
                    </div>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                    <div className="w-full lg:w-[55%] lg:sticky lg:top-24 h-fit">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 flex items-center justify-center p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                        >
                            <div className="absolute top-6 left-6 bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-lg">
                                Bestseller
                            </div>
                            <img 
                                src={imageUrl} 
                                alt={product.product_name} 
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                        </motion.div>
                    </div>

                    <div className="w-full lg:w-[45%] flex flex-col">
                        <header className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="flex text-amber-400 text-xs">
                                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                </div>
                                <span className="h-1 w-1 bg-gray-300 rounded-full" />
                                <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
                                    500+ Happy Customers
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif text-gray-900 leading-[1.1]">
                                {product.product_name || product.title}
                            </h1>

                            <div className="flex items-center gap-6 pt-2">
                                <span className="text-4xl font-black text-amber-600">
                                    ₹{product.product_price || product.price}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400 line-through decoration-amber-500/30 font-medium">
                                        ₹{Number(product.product_price || product.price) + 150}
                                    </span>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Save 15%</span>
                                </div>
                            </div>
                        </header>

                        <div className="flex flex-wrap gap-3 mb-10">
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-xl flex items-center gap-2">
                                <FaLeaf /> 100% Vegetarian
                            </span>
                            <span className="px-4 py-2 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-xl flex items-center gap-2">
                                <FaStar /> Traditional Recipe
                            </span>
                        </div>

                        <div className="mb-10 border-b border-gray-100 flex gap-8">
                            {["description", "details"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all ${activeTab === tab ? "text-gray-900" : "text-gray-300 hover:text-gray-500"}`}
                                >
                                    {tab}
                                    {activeTab === tab && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
                                </button>
                            ))}
                        </div>

                        <div className="mb-10 min-h-[80px]">
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-gray-500 leading-relaxed text-sm md:text-base"
                                >
                                    {activeTab === "description" 
                                        ? (product.description || "A Lonavala specialty, Maganlal Chikki is made with premium jaggery and roasted peanuts for a crunch that melts in your mouth.")
                                        : "Storage: Store in a cool, dry place. Shelf life: 4 months from packaging. Ingredients: Peanuts, Jaggery, Sugar, Ghee."
                                    }
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="space-y-6 mt-auto">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm w-full sm:w-auto">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-amber-600 transition-colors"
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                    <span className="w-10 text-center font-black text-gray-900">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-amber-600 transition-colors"
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                </div>

                                <button 
                                    onClick={() => dispatch(addToCart({ ...product, quantity }))}
                                    className="flex-1 w-full bg-gray-900 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-4 hover:bg-amber-600 transition-all duration-500 group shadow-lg active:scale-95"
                                >
                                    <FaShoppingCart className="group-hover:rotate-12 transition-transform" /> ADD TO BASKET
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6">
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                                    <FaTruck className="text-amber-500" />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-gray-900 uppercase">Express</span>
                                        <span className="text-[10px] text-gray-400">2-3 Day Delivery</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                                    <FaShieldAlt className="text-amber-500" />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-gray-900 uppercase">Secure</span>
                                        <span className="text-[10px] text-gray-400">100% Safe Payments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-32">
                    <RelatedProducts 
                        products={products} 
                        currentId={productid} 
                        catId={catid} 
                    />
                </div>
            </div>
        </div>
    );
}