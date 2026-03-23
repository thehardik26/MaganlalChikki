import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart, FaChevronLeft, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/Store/slice/cartslice";
import { addFav } from "../redux/Store/slice/favslice";
import PageHeader from "../global/PageHeader";

const getSingleProduct = async (id) => {
    const response = await axios.get(`https://appy.trycatchtech.com/v3/maganlalchikki/product_details?product_id=${id}`);
    return response.data[0];
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getSingleProduct(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: product.id,
            title: product.product_name,
            price: product.product_price,
            image: product.product_image,
            quantity: quantity
        }));
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <PageHeader title={product?.product_name || "Product Details"} />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors mb-8 font-bold uppercase text-[10px] tracking-widest"
                >
                    <FaChevronLeft size={10} /> Back to Shop
                </button>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row gap-12 p-8 md:p-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-1/2 flex items-center justify-center bg-amber-50/20 rounded-[2.5rem] p-10 border border-amber-100/50"
                    >
                        <img 
                            src={product?.product_image} 
                            alt={product?.product_name} 
                            className="w-full h-auto object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-1/2 flex flex-col justify-center"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    Authentic Maganlal
                                </span>
                                <div className="flex items-center gap-1 text-amber-500 text-xs ml-2">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    <span className="text-gray-400 ml-1 font-bold">(4.9)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif italic text-gray-900 leading-tight mb-4 uppercase tracking-tighter">
                                {product?.product_name}
                            </h1>
                            <p className="text-amber-600 text-3xl font-black tracking-tight">
                                ₹{product?.product_price}
                            </p>
                        </div>

                        <div className="text-gray-500 text-sm leading-relaxed mb-10 border-t border-gray-100 pt-8">
                            <p className="mb-4">
                                {product?.description || "Indulge in the legendary crunch of Maganlal Chikki, a heritage snack from Lonavala. Crafted with the finest jaggery and premium nuts, this traditional delicacy offers a perfect blend of health and sweetness."}
                            </p>
                            <ul className="grid grid-cols-2 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                <li className="flex items-center gap-2"><span className="h-1 w-1 bg-amber-500 rounded-full"></span> 100% Vegetarian</li>
                                <li className="flex items-center gap-2"><span className="h-1 w-1 bg-amber-500 rounded-full"></span> No Preservatives</li>
                                <li className="flex items-center gap-2"><span className="h-1 w-1 bg-amber-500 rounded-full"></span> Freshly Packed</li>
                                <li className="flex items-center gap-2"><span className="h-1 w-1 bg-amber-500 rounded-full"></span> Lonavala Famous</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-gray-50">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-5 py-2 hover:bg-white rounded-xl transition-all text-gray-500 font-bold"
                                >-</button>
                                <span className="w-12 text-center font-black text-gray-800">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-5 py-2 hover:bg-white rounded-xl transition-all text-gray-500 font-bold"
                                >+</button>
                            </div>

                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-amber-500 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.2em] hover:bg-gray-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-amber-200"
                            >
                                <FaShoppingCart size={14} /> Add to Shopping Bag
                            </button>

                            <button 
                                onClick={() => dispatch(addFav({ id: product.id, name: product.product_name, price: product.product_price, images: product.product_image }))}
                                className="p-5 border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all hover:bg-red-50"
                            >
                                <FaHeart size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 pt-8 border-t border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Category: <span className="text-amber-600 ml-2">Chikki & Sweets</span>
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                SKU: <span className="text-gray-800 ml-2">MC-{id}</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;