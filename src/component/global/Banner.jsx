import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import getGallery from "../utils/getGallery";

export default function Banner() {

    const { data = [], isFetching } = useQuery({
        queryKey: ["banner"],
        queryFn: getGallery
    });

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!data.length) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev === data.length - 1 ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [data]);

    if (isFetching) {
        return (
            <div className="text-center py-10 text-xl">
                Loading...
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="text-center py-10">
                No banners available
            </div>
        );
    }

    const nextSlide = () => {
        setCurrent((prev) =>
            prev === data.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? data.length - 1 : prev - 1
        );
    };

    return (
        <div className="relative w-full">

            <div className="relative h-56 md:h-125 overflow-hidden">

                {data.map((item, index) => (
                    <img
                        key={index}
                        src={item.image}
                        alt="banner"
                        className={`absolute w-full h-full object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"
                            }`}
                    />
                ))}

            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
            >
                ❮
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
            >
                ❯
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">

                {data.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition ${index === current
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                    />
                ))}

            </div>

        </div>
    );
}