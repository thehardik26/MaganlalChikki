import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaEye, FaCheck, FaPlus, FaMinus } from "react-icons/fa";
import { addToCart } from "../redux/Store/slice/cartslice";
import toast from "react-hot-toast";

const ChatProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleIncrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Dispatch for the specified quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          images: [product.image],
          category_id: product.cat_id || 1,
        })
      );
    }

    setAdded(true);
    toast.success(`Added ${quantity}x ${product.title} to cart!`, {
      icon: "🍬",
      style: {
        borderRadius: "12px",
        background: "#1f2937",
        color: "#fff",
      },
    });
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="p-2.5 my-2 bg-amber-50/70 border border-amber-200/80 rounded-2xl hover:border-amber-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <img
          src={product.image}
          alt={product.title}
          className="w-14 h-14 object-cover rounded-xl border border-amber-100 shrink-0 shadow-2xs"
          onError={(e) => {
            e.target.src = "https://placehold.co/100x100?text=Chikki";
          }}
        />
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md">
            {product.category || "Chikki"}
          </span>
          <h4 className="text-xs font-bold text-gray-800 truncate mt-0.5" title={product.title}>
            {product.title}
          </h4>
          <div className="text-xs font-extrabold text-amber-900 mt-0.5">
            ₹{product.price}{" "}
            <span className="text-[10px] font-normal text-gray-500">
              (Total: ₹{product.price * quantity})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={`/product/${product.cat_id || 1}/${product.id}`}
            className="p-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-100/70 rounded-xl transition-colors"
            title="View Product Page"
          >
            <FaEye size={13} />
          </Link>
        </div>
      </div>

      {/* Quantity Selector & Add to Cart Controls */}
      <div className="mt-2 pt-2 border-t border-amber-200/50 flex items-center justify-between gap-2">
        {/* Quantity Controls */}
        <div className="flex items-center border border-amber-200 bg-white rounded-xl overflow-hidden shrink-0">
          <button
            type="button"
            onClick={handleDecrement}
            className="px-2 py-1 text-gray-500 hover:bg-amber-50 hover:text-amber-800 transition"
            title="Decrease quantity"
          >
            <FaMinus size={9} />
          </button>
          <span className="px-2.5 py-1 text-xs font-bold text-gray-800 min-w-5 text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            className="px-2 py-1 text-gray-500 hover:bg-amber-50 hover:text-amber-800 transition"
            title="Increase quantity"
          >
            <FaPlus size={9} />
          </button>
        </div>

        {/* Add / Added Button */}
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          {added ? (
            <Link
              to="/cart"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
            >
              <FaCheck size={10} />
              <span>Added! View Cart →</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <FaShoppingCart size={11} />
              <span>Add {quantity > 1 ? `(${quantity})` : ""} to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatProductCard;
