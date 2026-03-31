import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import getProducts, { getCategory } from "../utils/getProducts";
import { addToCart } from "../redux/Store/slice/cartslice";
import { addFav } from "../redux/Store/slice/favslice";

const HomeCategory = () => {
    const { data, isFetching, isError } = useQuery({
        queryKey: ["caty"],
        queryFn: getCategory,
    });

    if (isFetching) {
        return (
            <div className="flex h-40 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-10 text-red-500 font-medium">
                Failed to load categories. Please try again later.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 bg-gray-50">
            {data?.map((category) => (
                <AllProducts key={category.id} data={category} />
            ))}
        </div>
    );
};

const AllProducts = ({ data }) => {
    const { data: products, isFetching } = useQuery({
        queryKey: ["product", data?.id],
        queryFn: () => getProducts(data?.id),
        enabled: !!data?.id,
        staleTime: 1000 * 60 * 5,
    });

    if (!isFetching && (!products || products.length === 0)) {
        return null;
    }

    return (
        <div className={`${isFetching ? "opacity-50" : "opacity-100"} transition-opacity duration-500`}>
            <Product
                name={data?.cat_name}
                banner={data?.cat_image}
                products={products || []}
                catId={data?.id}
            />
        </div>
    );
};

const Product = React.memo(({ name, products, banner, catId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("Latest Products");

    const filterTabs = ["Latest Products", "Best Selling", "Top Rating", "Featured Products"];

    const filteredProducts = useMemo(() => {
        const list = [...products];
        switch (activeFilter) {
            case "Best Selling":
                return list.sort((a, b) => (Number(b.sales) || 0) - (Number(a.sales) || 0));
            case "Top Rating":
                return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
            case "Featured Products":
                return list.filter((item) => item.featured || item.is_featured);
            default:
                return list.sort((a, b) => Number(b.id) - Number(a.id));
        }
    }, [products, activeFilter]);

    return (
        <div className="bg-white py-12 px-4 md:px-10 lg:px-12 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between bg-white border-t-4 border-amber-500 shadow-sm rounded-t-lg overflow-hidden">
                    <div className="bg-amber-500 text-white px-10 py-4 flex items-center gap-3 font-serif font-bold text-xl uppercase tracking-widest w-full md:w-auto shadow-md">
                        <span className="text-2xl animate-pulse">❀</span> {name || "CHIKKI"}
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 px-6 py-4 text-[13px] font-bold uppercase tracking-wider text-gray-500">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`relative transition-all duration-300 pb-1 ${activeFilter === tab ? "text-amber-600" : "hover:text-amber-500"
                                    }`}
                            >
                                {tab}
                                {activeFilter === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-10 flex flex-col lg:flex-row items-start gap-12">
                <div className="w-full lg:w-[30%] relative flex flex-col items-center">
                    <motion.div
                        initial={{ rotate: -15, scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="absolute top-0 left-0 bg-amber-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-center text-[11px] font-black leading-tight rotate-[-15deg] z-20 p-2 shadow-xl border-4 border-white"
                    >
                        Try our <br /> Tasty
                    </motion.div>

                    <h2 className="text-amber-600 text-5xl font-serif italic mb-8 text-center leading-tight tracking-tight">
                        {name || "Special Chikki"}
                    </h2>

                    <div className="relative group cursor-pointer" onClick={() => navigate(`/shop?category=${catId}`)}>
                        <div className="w-72 h-72 md:w-85 md:h-85 rounded-full border-8 border-dashed border-amber-100 p-3 animate-[spin_60s_linear_infinite] group-hover:pause">
                        </div>
                        <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl bg-white border-4 border-white">
                            <img
                                src={banner}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="category banner"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[70%] grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col group p-3 bg-white border border-gray-100 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 cursor-pointer"
                                onClick={() => navigate(`/product/${catId}/${product.id}`)}
                            >
                                <div className="relative overflow-hidden mb-4 rounded-xl bg-gray-50 flex items-center justify-center aspect-square">
                                    <img
                                        src={product.images?.[0] || product.product_image || product.image}
                                        alt={product.title}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                                        loading="lazy"
                                    />

                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col gap-3 transform translate-x-16 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents clicking the card
                                                navigate(`/product/${catId}/${product.id}`);
                                            }}
                                            className="bg-white p-3 rounded-full shadow-lg text-gray-600 hover:bg-amber-500 hover:text-white transition-colors"
                                            title="View Details">
                                            <FaEye size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(addFav(product));
                                            }}
                                            className="bg-white p-3 rounded-full shadow-lg text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
                                            title="Add to Wishlist"
                                        >
                                            <FaHeart size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(addToCart(product));
                                            }}
                                            className="bg-white p-3 rounded-full shadow-lg text-gray-600 hover:bg-emerald-500 hover:text-white transition-colors"
                                            title="Add to Cart"
                                        >
                                            <FaShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-1 space-y-1.5">
                                    <h3 className="text-[14px] text-gray-800 font-bold line-clamp-2 h-10 leading-snug group-hover:text-amber-600 transition-colors">
                                        {product.title || product.product_name}
                                    </h3>
                                    <p className="text-gray-400 text-[11px] line-clamp-1 italic font-medium">
                                        {product.small_description || "Traditional homemade taste"}
                                    </p>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                                        <span className="text-amber-600 font-black text-lg">
                                            ₹{product.price || product.product_price}
                                        </span>
                                        <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded">
                                            {product.rating || "4.5"} ★
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
});

export default HomeCategory;