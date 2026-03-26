import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";

const RelatedProducts = ({ products, currentId, catId }) => {
    const safeProducts = Array.isArray(products) ? products : [];

    const related = safeProducts
        .filter((p) => String(p.id) !== String(currentId))
        .slice(0, 4);

    if (related.length === 0) return null;

    return (
        <div className="mt-24 border-t border-gray-100 pt-16">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">You might also love</span>
                    <h2 className="text-4xl font-serif italic text-gray-900 mt-2">Related Delights</h2>
                </div>
                <Link 
                    to="/shop" 
                    className="text-xs font-black uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-all"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((item, index) => {
                    let itemImages = item.product_images || item.images || item.image || [];
                    if (typeof itemImages === "string") itemImages = [itemImages];
                    
                    const itemImg = itemImages[0]?.startsWith("http") 
                        ? itemImages[0] 
                        : itemImages[0] 
                            ? `https://appy.trycatchtech.com${itemImages[0]}`
                            : "https://via.placeholder.com/300";

                    return (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group"
                        >
                            <Link to={`/product/${catId}/${item.id}`}>
                                <div className="relative aspect-square bg-white rounded-4xl overflow-hidden mb-4 flex items-center justify-center p-6 border border-gray-50 group-hover:border-amber-100 group-hover:shadow-xl group-hover:shadow-amber-900/5 transition-all duration-500">
                                    <img 
                                        src={itemImg} 
                                        alt={item.product_name} 
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                                    />
                                    <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white p-4 rounded-full shadow-2xl text-amber-600 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <FaEye size={18} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-2">
                                    <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-amber-600 transition-colors">
                                        {item.product_title || item.title || item.product_name}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-amber-600 font-black text-lg">₹{item.price || item.product_price }</p>
                                        <div className="h-1 w-1 bg-gray-200 rounded-full group-hover:w-8 group-hover:bg-amber-400 transition-all duration-300"></div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default RelatedProducts;