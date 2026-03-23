import { useSelector, useDispatch } from "react-redux";
import {
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
} from "../redux/Store/slice/cartslice.js";

export default function Cart() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="h-[60vh] flex items-center justify-center text-xl font-semibold">
                Your cart is empty 🛒
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="space-y-6">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-6 border p-4 rounded-lg shadow"
                    >
                        <img
                            src={item.image}
                            className="w-24 h-24 object-contain"
                        />

                        <div className="flex-1">
                            <h2 className="font-semibold">{item.title}</h2>
                            <p className="text-amber-600 font-bold">
                                ₹{item.price}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => dispatch(decreaseQty(item.id))}
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                -
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                onClick={() => dispatch(increaseQty(item.id))}
                                className="px-3 py-1 bg-gray-200 rounded"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-red-500 font-bold"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex justify-between items-center">
                <button
                    onClick={() => dispatch(clearCart())}
                    className="bg-red-500 text-white px-6 py-2 rounded"
                >
                    Clear Cart
                </button>

                <div className="text-xl font-bold">
                    Total: ₹{total}
                </div>
            </div>
        </div>
    );
}