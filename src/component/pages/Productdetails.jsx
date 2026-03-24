import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Store/slice/cartslice.js";
import { FaArrowLeft, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Error fetching product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
        // Optional: navigate to cart or show a toast
        alert("Added to cart!");
    };

    if (!product && !loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <span className="text-8xl mb-4">🕵️‍♂️</span>
                <h2 className="text-xl font-black uppercase text-gray-400">Product Not Found</h2>
                <p className="text-gray-400 text-sm mb-6">The item you are looking for doesn't exist or has been moved.</p>
                <button
                    onClick={() => navigate("/shop")}
                    className="bg-amber-500 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-200"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    let images = product.product_images || product.images || product.image || [];
    if (typeof images === "string") images = [images];
    const imageUrl = images[0]?.startsWith("http") ? images[0] : images[0] ? `${BASE_URL}${images[0]}` : "https://via.placeholder.com/500";

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 font-sans bg-gray-50 min-h-screen">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-amber-500 mb-8 transition-colors">
                <FaArrowLeft size={10} /> <span className="text-[10px] font-black uppercase tracking-widest">Back to Shop</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Product Image */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
                    <img src={imageUrl} alt={product.title} className="w-full h-auto object-cover rounded-3xl" />
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-5xl font-black uppercase text-gray-800 tracking-tighter leading-none mb-4">
                            {product.display_name || product.title}
                        </h1>
                        <p className="text-amber-600 font-black text-3xl">₹{product.price}</p>
                    </div>

                    <div className="text-gray-500 leading-relaxed font-medium">
                        {product.description || "No description available for this delicious treat."}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-red-500 transition-colors">
                                <FaMinus size={12} />
                            </button>
                            <span className="font-black text-lg w-4 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <FaPlus size={12} />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-amber-500 text-white py-4 rounded-full font-black uppercase tracking-widest text-[12px] shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all flex items-center justify-center gap-3"
                        >
                            <FaShoppingCart /> Add to Cart
                        </button>
                    </div>

                    {/* Features/Badges */}
                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-black uppercase text-emerald-700">100% Organic</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-[10px] font-black uppercase text-blue-700">Freshly Made</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}