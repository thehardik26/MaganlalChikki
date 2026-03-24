import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, HeartOff, Trash2, ShoppingCart } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { removeFav, clearFav } from "../redux/Store/slice/favslice";
import { addToCart } from "../redux/Store/slice/cartslice";

const BASE_URL = "http://localhost:5000";

const Fav = () => {
    const data = useSelector((store) => store.fav.list);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-amber-50/30 min-h-screen font-sans">
            <div className="flex flex-col gap-4 max-w-2xl mx-auto pt-10">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-800">My Favorites</h1>
                        <div className="h-1 w-20 bg-amber-500 mt-2 rounded-full"></div>
                    </div>
                    
                    {data?.length > 0 && (
                        <button 
                            onClick={() => dispatch(clearFav())}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest transition-all px-4 py-2 rounded-full border border-red-100 hover:bg-red-50"
                        >
                            <Trash2 size={14} />
                            Clear All
                        </button>
                    )}
                </div>

                <AnimatePresence mode="popLayout">
                    {data?.map((item, index) => {
                        let images = item.product_images || item.images || item.image || [];
                        if (typeof images === "string") images = [images];
                        const imageUrl = images[0]?.startsWith("http") 
                            ? images[0] 
                            : images[0] ? `${BASE_URL}${images[0]}` : "https://via.placeholder.com/150";

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative bg-white rounded-2xl shadow-sm flex items-center p-4 border border-amber-100 group transition-all"
                            >
                                <span className="absolute -left-2 -top-4 text-8xl font-black text-amber-500/10 select-none pointer-events-none italic">
                                    {index + 1}
                                </span>

                                <div className="relative z-10 flex items-center w-full gap-4">
                                    <img
                                        src={imageUrl}
                                        alt={item.display_name}
                                        className="w-16 h-16 object-cover rounded-xl shadow-sm border-2 border-white shrink-0 cursor-pointer"
                                        onClick={() => navigate(`/product/${item.id}`)}
                                    />

                                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                        <h3 className="text-gray-800 font-bold text-sm leading-tight group-hover:text-amber-600 transition-colors">
                                            {item.display_name || item.product_title || item.title}
                                        </h3>
                                        <p className="text-amber-600 font-black mt-0.5">
                                            ₹{item.display_price || item.price}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                                            className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-md shadow-emerald-100 hover:bg-emerald-600 active:scale-90 transition-all"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                        <button
                                            onClick={() => dispatch(removeFav(item.id))}
                                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Remove"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {(!data || data.length === 0) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-amber-200"
                    >
                        <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HeartOff className="text-amber-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tighter">Your list is empty</h2>
                        <button 
                            onClick={() => navigate("/shop")}
                            className="bg-amber-500 text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all mt-6"
                        >
                            Explore Shop
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Fav;