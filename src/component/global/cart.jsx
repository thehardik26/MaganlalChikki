import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
} from "../redux/Store/slice/cartslice.js";
import { FaTrash, FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";

const BASE_URL = "http://localhost:5000";

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const [paymentMethod, setPaymentMethod] = useState("online");

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.display_price || item.product_price || item.price || 0;
        return acc + price * item.quantity;
    }, 0);

    const discountAmount = subtotal * 0.05;
    const amountAfterDiscount = subtotal - discountAmount;
    const gstAmount = amountAfterDiscount * 0.18;
    const total = amountAfterDiscount + gstAmount;

    const handlePayment = () => {
        if (total <= 0) return;
        if (paymentMethod === "cod") {
            alert("Order Placed Successfully via Cash on Delivery!");
            dispatch(clearCart());
            navigate("/");
            return;
        }
        if (!window.Razorpay) {
            alert("Payment Gateway is loading...");
            return;
        }

        const options = {
            key: "rzp_test_SV4aJG62QgpSdl",
            amount: Math.round(total * 100),
            currency: "INR",
            name: "Chikki Shop",
            handler: (res) => {
                alert("Payment Successful!");
                dispatch(clearCart());
                navigate("/");
            },
            theme: { color: "#F59E0B" },
        };
        new window.Razorpay(options).open();
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <span className="text-6xl md:text-8xl mb-4">🛒</span>
                <h2 className="text-lg md:text-xl font-black uppercase text-gray-400">Cart is Empty</h2>
                <button onClick={() => navigate("/shop")} className="mt-4 bg-amber-500 text-white px-8 py-3 rounded-full font-black uppercase text-[10px]">Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-10">
            <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 md:mb-10 border-b pb-6 gap-4">
                    <div>
                        <button onClick={() => navigate("/shop")} className="flex items-center gap-2 text-gray-400 hover:text-amber-500 mb-2 transition-colors">
                            <FaArrowLeft size={10} /> <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                        </button>
                        <h1 className="text-2xl md:text-4xl font-black uppercase text-gray-800 tracking-tighter">Shopping Cart</h1>
                    </div>
                    <button onClick={() => dispatch(clearCart())} className="w-fit text-red-500 font-black uppercase text-[10px] border border-red-100 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all">
                        Clear All
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            let images = item.product_images || item.product_image || item.images || item.image || [];
                            if (typeof images === "string") images = [images];
                            const imageUrl = images[0]?.startsWith("http") ? images[0] : images[0] ? `${BASE_URL}${images[0]}` : "https://via.placeholder.com/150";

                            return (
                                <div key={item.id} className="flex flex-row items-center gap-3 md:gap-6 bg-white p-3 md:p-5 rounded-3xl md:rounded-4xl shadow-sm border border-gray-100">
                                    <img src={imageUrl} className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl md:rounded-2xl bg-gray-50" alt="" />
                                    
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-black text-[10px] md:text-[11px] uppercase text-gray-800 truncate">
                                            {item.display_name || item.product_title || item.title}
                                        </h2>
                                        <p className="text-amber-600 font-black text-sm md:text-lg">₹{item.display_price || item.product_price || item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4 bg-gray-50 px-2 md:px-4 py-1 md:py-2 rounded-full">
                                        <button onClick={() => dispatch(decreaseQty(item.id))} className="px-1 md:px-0 font-bold text-gray-400 hover:text-red-500">-</button>
                                        <span className="font-black text-xs md:text-sm">{item.quantity}</span>
                                        <button onClick={() => dispatch(increaseQty(item.id))} className="px-1 md:px-0 font-bold text-gray-400 hover:text-emerald-500">+</button>
                                    </div>

                                    <button onClick={() => dispatch(removeFromCart(item.id))} className="text-gray-300 hover:text-red-500 p-1 md:p-2">
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-4xl md:rounded-[3rem] p-6 md:p-10 shadow-xl border border-gray-100 sticky top-6">
                            <h2 className="text-[10px] font-black uppercase text-gray-400 mb-4 md:mb-6 tracking-widest">Payment Method</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mb-8">
                                <div onClick={() => setPaymentMethod("online")} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "online" ? "border-amber-500 bg-amber-50" : "border-gray-50 bg-gray-50"}`}>
                                    <div className="flex items-center gap-3">
                                        <FaCreditCard className="text-amber-500" />
                                        <span className="text-[10px] font-black uppercase">Online / UPI</span>
                                    </div>
                                    {paymentMethod === "online" && <FaCheckCircle className="text-amber-500" />}
                                </div>
                                <div onClick={() => setPaymentMethod("cod")} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-amber-500 bg-amber-50" : "border-gray-50 bg-gray-50"}`}>
                                    <div className="flex items-center gap-3">
                                        <FaMoneyBillWave className="text-amber-500" />
                                        <span className="text-[10px] font-black uppercase">COD</span>
                                    </div>
                                    {paymentMethod === "cod" && <FaCheckCircle className="text-amber-500" />}
                                </div>
                            </div>

                            <div className="space-y-3 text-[11px] font-bold uppercase text-gray-500 tracking-tight">
                                <div className="flex justify-between"><span>Subtotal</span><span className="text-gray-800">₹{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-emerald-500"><span>Discount (5%)</span><span>- ₹{discountAmount.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>GST (18%)</span><span className="text-gray-800">₹{gstAmount.toFixed(2)}</span></div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between items-center text-gray-800">
                                    <span className="font-black">Total</span>
                                    <span className="text-xl md:text-2xl font-black text-amber-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={handlePayment} className="w-full bg-amber-500 text-white py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-[10px] mt-8 shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all">
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}