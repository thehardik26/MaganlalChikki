import { NavLink } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-amber-200 shadow-lg">
            {/* Social Media Header */}
            <div className="flex items-center justify-center border-b border-amber-200 p-6 lg:justify-between max-w-7xl mx-auto">
                <div className="mr-12 hidden lg:block font-medium">
                    <span>Connect with us for sweet updates:</span>
                </div>
                
                <div className="flex justify-center space-x-6">
                    <a href="#" className="text-neutral-400 hover:text-amber-600 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>
                    <a href="#" className="text-neutral-400 hover:text-amber-600 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="mx-auto max-w-7xl px-6 py-10 text-center md:text-left">
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4 text-left">
                    
                    {/* Brand Section */}
                    <div>
                        <h6 className="mb-4 flex items-center justify-center font-bold uppercase text-amber-600 md:justify-start">
                            <img src="/src/assets/images/web-logo-3.png" alt="Logo" className="h-20 mr-3" />
                        </h6>
                        <p className="text-sm leading-relaxed">
                            Crafting the finest Lonavala Chikki since 1920. Pure ingredients, 
                            traditional recipes, and a taste that brings back memories.
                        </p>
                    </div>

                    {/* Shop Section */}
                    <div>
                        <h6 className="mb-4 font-bold uppercase text-gray-800">Shop Online</h6>
                        <ul className="space-y-3 text-sm">
                            <li><NavLink to="/shop" className="hover:text-amber-600 transition-colors">Peanut Chikki</NavLink></li>
                            <li><NavLink to="/shop" className="hover:text-amber-600 transition-colors">Dry Fruit Chikki</NavLink></li>
                            <li><NavLink to="/shop" className="hover:text-amber-600 transition-colors">Crushed Chikki</NavLink></li>
                            <li><NavLink to="/shop" className="hover:text-amber-600 transition-colors">Fudge & Sweets</NavLink></li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h6 className="mb-4 font-bold uppercase text-gray-800">Support</h6>
                        <ul className="space-y-3 text-sm">
                            <li><NavLink to="/aboutUs" className="hover:text-amber-600 transition-colors">Our Legacy</NavLink></li>
                            <li><NavLink to="/contactUs" className="hover:text-amber-600 transition-colors">Track Order</NavLink></li>
                            <li><NavLink to="/contactUs" className="hover:text-amber-600 transition-colors">Shipping Policy</NavLink></li>
                            <li><NavLink to="/contactUs" className="hover:text-amber-600 transition-colors">Bulk Inquiries</NavLink></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h6 className="mb-4 font-bold uppercase text-gray-800">Get in Touch</h6>
                        <div className="space-y-4 text-sm">
                            <p className="flex items-start justify-center md:justify-start">
                                <svg className="mr-3 h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Maganlal Chikki Products Pvt Ltd<br/>
                                Shed No. 49A & B, Opp. Monsento LICEL, Nangargaon, Lonavala 410401 Dist. Pune
                            </p>
                            <p className="flex items-center justify-center md:justify-start">
                                <svg className="mr-3 h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                sales@maganlalchikki.in
                            </p>
                            <p className="flex items-center justify-center md:justify-start">
                                <svg className="mr-3 h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +917666530969Contact <br/>Time :- 9 AM To 6 PM <br/>Factory Closed – Thursday
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-gray-50 p-6 text-center text-sm border-t border-amber-200">
                <span className="text-neutral-500">© 2026 Copyright:</span>
                <NavLink className="ml-1 font-bold text-amber-600 hover:text-amber-700" to="/">
                    Manganlal Chikki Pvt Ltd.
                </NavLink>
            </div>
        </footer>
    );
}