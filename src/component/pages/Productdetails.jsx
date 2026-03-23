import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageHeader from "../global/PageHeader";

const getSingleProduct = async (id) => {
    const response = await axios.get(`https://appy.trycatchtech.com/v3/maganlalchikki/product_details?product_id=${id}`);
    return response.data[0]; 
};

export default function ProductDetails() {
    const { id } = useParams();

    const { data: product, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getSingleProduct(id),
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">
            <PageHeader title={product?.product_name || "Product Details"} />
            
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    
                    <div className="bg-amber-50/30 rounded-2xl p-8 border border-amber-100/50">
                        <img 
                            src={product?.product_images} 
                            alt={product?.product_title} 
                            className="w-full h-auto object-cover rounded-lg shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                Authentic Collection
                            </span>
                            <h1 className="text-4xl font-serif text-gray-900 mt-4 leading-tight">
                                {product?.product_title}
                            </h1>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl font-bold text-amber-600 font-sans">
                                ₹{product?.product_price}
                            </span>
                            <span className="text-sm text-gray-400 line-through decoration-amber-200">
                                ₹{parseInt(product?.product_price) + 50}
                            </span>
                        </div>

                        <div className="prose prose-sm text-gray-600 leading-relaxed border-y border-gray-100 py-8 mb-8">
                            <p>
                                {product?.description || "Experience the traditional taste of Lonavala with our premium Maganlal Chikki. Handcrafted using high-quality ingredients and a time-honored recipe for that perfect crunch."}
                            </p>
                        </div>

                        <div className="flex gap-4 mb-10">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                <button className="px-4 py-2 hover:bg-amber-100 transition-colors text-gray-500">-</button>
                                <input 
                                    type="number" 
                                    defaultValue="1" 
                                    className="w-12 bg-transparent text-center text-sm font-bold focus:outline-none"
                                />
                                <button className="px-4 py-2 hover:bg-amber-100 transition-colors text-gray-500">+</button>
                            </div>
                            <button className="flex-1 bg-amber-500 text-white font-bold py-4 rounded-lg uppercase text-[11px] tracking-widest hover:bg-amber-600 hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]">
                                Add to Cart
                            </button>
                        </div>

                        <div className="space-y-3 text-[11px] uppercase tracking-widest text-gray-400 border-t border-gray-50 pt-8">
                            <p>Category: <span className="text-amber-600 font-bold ml-2">Chikki</span></p>
                            <p>Shipping: <span className="text-gray-600 font-medium ml-2">Available across India</span></p>
                            <p>Tags: <span className="text-gray-600 font-medium ml-2">Traditional, Sweet, Healthy</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}