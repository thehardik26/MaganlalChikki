import { Link } from "react-router-dom";

export default function PageHeader({ title }) {
    return (
        <div
            className="relative h-48 sm:h-60 flex items-center justify-center text-white overflow-hidden"
            style={{
                backgroundImage: "url('/src/assets/images/CHikki.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative text-center z-10">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                    {title}
                </h1>

                <div className="mt-3 text-sm sm:text-base font-medium flex items-center justify-center space-x-2">
                    <Link to="/" className="hover:text-amber-400 transition-colors">
                        Home
                    </Link>

                    <span className="text-gray-300">/</span>

                    <span className="text-amber-500">{title}</span>
                </div>
            </div>
        </div>
    );
}