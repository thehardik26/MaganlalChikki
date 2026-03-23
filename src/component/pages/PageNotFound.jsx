import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <main className="grid min-h-[70vh] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-bold text-amber-600 uppercase tracking-widest">404 Error</p>

                <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
                    Page not found
                </h1>

                <p className="mt-6 text-lg font-medium text-gray-500 sm:text-xl/8 max-w-lg mx-auto">
                    Sorry, we couldn’t find the sweet treat you’re looking for. It might have been moved or eaten!
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">

                    <Link
                        to="/"
                        className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-all active:scale-95"
                    >
                        Go back home
                    </Link>

                    <Link
                        to="/contactUs"
                        className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors"
                    >
                        Contact support <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}