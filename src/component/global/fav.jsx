import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, HeartOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removeFav } from "../redux/Store/slice/favslice";

const Fav = () => {
    const data = useSelector((store) => store.fav.list);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-amber-50/30 min-h-screen font-sans">
            <div className="flex flex-col gap-4 max-w-2xl mx-auto pt-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-serif font-bold text-gray-800">My Favorites</h1>
                    <div className="h-1 w-20 bg-amber-500 mt-2 rounded-full"></div>
                </div>

                <AnimatePresence mode="popLayout">
                    {data?.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            whileHover={{ scale: 1.02 }}
                            className="relative bg-white rounded-2xl shadow-sm hover:shadow-md flex items-center p-4 overflow-hidden border border-amber-100 group transition-all"
                        >
                            <span className="absolute -left-2 -top-4 text-8xl font-black text-amber-500/10 select-none pointer-events-none z-0 italic">
                                {index + 1}
                            </span>

                            <div className="relative z-10 flex items-center w-full">
                                <img
                                    src={item.images}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-xl shadow-sm border-2 border-white shrink-0"
                                />

                                <div className="ml-5 flex-1">
                                    <h3 className="text-gray-800 font-bold text-lg leading-tight group-hover:text-amber-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-amber-600 font-black mt-1">
                                        ₹{item.price}
                                    </p>
                                </div>

                                <button
                                    onClick={() => dispatch(removeFav(item.id))}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Remove"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
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
                        <h2 className="text-2xl font-bold text-gray-800">Your list is empty</h2>
                        <p className="text-gray-500 mt-2 mb-8">Your Favorite Crunch is Missing!</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 active:scale-95 transition-all"
                        >
                            Explore Chikkis
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Fav;