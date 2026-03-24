import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFav } from "../redux/Store/slice/favslice";
import toast from "react-hot-toast";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.04,
            type: "tween",
            duration: 0.25,
            ease: "easeOut",
        },
    }),
};

const ProductDetail = ({ name, data, categoryId }) => {
    const favList = useSelector((store) => store.fav.list);
    const dispatch = useDispatch();

    const addtoFav = (e, product, isFav) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isFav) {
            const item = {
                id: product.id,
                name: product.title,
                images: product.images?.[0],
            };

            dispatch(addFav(item));
            toast.success("Added to favourites ✨", {
                icon: '🧡',
                style: { border: '1px solid #d97706', color: '#92400e' }
            });
        } else {
            toast.error("Already in favourites 🧡");
        }
    };

    return (
        <div className="text-gray-800  dark:text-gray-100 transition-colors duration-300">
            <div className="w-full mx-auto py-16 px-4">
                
                {/* Section Header */}
                <div className="relative mb-14">
                    {/* Amber Divider */}
                    <div className="w-full h-0.5 bg-amber-500 rounded"></div>

                    <div className="
                        absolute left-0  
                        flex items-center gap-2
                        bg-amber-500 dark:bg-amber-600
                        text-white
                        px-4 py-1.5
                        rounded-b-md
                        shadow-md
                    ">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm md:text-base font-bold uppercase tracking-wider">
                            {name}
                        </span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data?.map((product, i) => {
                        const isFav = favList.some((item) => item.id === product.id);

                        return (
                            <div key={product.id}>
                                <Link to={`/product/${categoryId}/${product.id}`}>
                                    <motion.div
                                        custom={i}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{ y: -6, scale: 0.98 }}
                                        transition={{
                                            type: "tween",
                                            duration: 0.12,
                                            ease: "easeOut",
                                        }}
                                        className="
                                            group w-full cursor-pointer
                                            bg-white dark:bg-[#1e293b]
                                            border border-gray-100 dark:border-gray-800
                                            shadow-sm dark:shadow-black/30
                                            rounded-2xl
                                            hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-900/50
                                            transition duration-200
                                        "
                                    >
                                        <div className="relative h-48 rounded-t-2xl overflow-hidden">
                                            
                                            {/* Heart Button */}
                                            <motion.div
                                                onClick={(e) => addtoFav(e, product, isFav)}
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ duration: 0.12 }}
                                                className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-black/60 p-2 rounded-full shadow-sm"
                                            >
                                                <Heart
                                                    className={`w-5 h-5 transition-colors ${isFav
                                                        ? "fill-amber-500 text-amber-500"
                                                        : "text-amber-600 hover:text-amber-500"
                                                        }`}
                                                />
                                            </motion.div>

                                            <motion.img
                                                src={product.images?.[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.18, ease: "easeOut" }}
                                            />

                                            {/* Warm Amber Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                            <div className="absolute bottom-3 left-3 text-amber-400 font-black text-lg">
                                                ₹{product.price}
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-1">
                                            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-amber-600 transition-colors duration-150">
                                                {product.title}
                                            </h3>

                                            <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed">
                                                {product.small_description}
                                            </p>
                                            
                                            <div className="pt-2">
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Details +
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;