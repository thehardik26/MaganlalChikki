import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    const shopLinks = [
        { name: "Peanut Chikki", path: "/shop" },
        { name: "Dry Fruit Chikki", path: "/shop" },
        { name: "Crushed Chikki", path: "/shop" },
        { name: "Fudge & Sweets", path: "/shop" },
        { name: "Gift Packs", path: "/shop" }
    ];

    const supportLinks = [
        { name: "Our Legacy", path: "/aboutUs" },
        { name: "Track Order", path: "/contactUs" },
        { name: "Shipping Policy", path: "/contactUs" },
        { name: "Bulk Inquiries", path: "/contactUs" }
    ];

    const socialLinks = [
        { Icon: FaFacebookF, label: "Facebook", url: "#" },
        { Icon: FaInstagram, label: "Instagram", url: "#" },
        { Icon: FaTwitter, label: "Twitter", url: "#" },
        { Icon: FaWhatsapp, label: "WhatsApp", url: "#" }
    ];

    return (
        <footer className="w-full bg-white border-t border-amber-200 shadow-lg font-sans">
            <div className="bg-amber-50/50">
                <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-6 border-b border-amber-200">
                    <div className="mb-4 md:mb-0 font-bold text-gray-700 uppercase tracking-tighter">
                        <span>Connect with us for sweet updates</span>
                    </div>
                    
                    <div className="flex items-center space-x-5">
                        {socialLinks.map(({ Icon, label, url }, idx) => (
                            <a 
                                key={idx} 
                                href={url} 
                                aria-label={label}
                                className="text-gray-400 hover:text-amber-600 transform hover:scale-110 transition-all duration-300"
                            >
                                <Icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <NavLink to="/" className="mb-6 block group">
                            <img 
                                src="/src/assets/images/web-logo-3.png" 
                                alt="Maganlal Chikki Logo" 
                                className="h-24 group-hover:brightness-110 transition-all" 
                            />
                        </NavLink>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
                            Crafting the finest Lonavala Chikki since 1920. Pure ingredients, 
                            traditional recipes, and a taste that brings back memories.
                        </p>
                    </div>

                    <div>
                        <h6 className="mb-6 font-black uppercase text-xs tracking-widest text-gray-900 border-b-2 border-amber-500 w-fit pb-1">
                            Shop Online
                        </h6>
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                            {shopLinks.map((link, i) => (
                                <li key={i}>
                                    <NavLink to={link.path} className="hover:text-amber-600 transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-amber-400 group-hover:w-3 transition-all"></span>
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h6 className="mb-6 font-black uppercase text-xs tracking-widest text-gray-900 border-b-2 border-amber-500 w-fit pb-1">
                            Support
                        </h6>
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                            {supportLinks.map((link, i) => (
                                <li key={i}>
                                    <NavLink to={link.path} className="hover:text-amber-600 transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-amber-400 group-hover:w-3 transition-all"></span>
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h6 className="mb-6 font-black uppercase text-xs tracking-widest text-gray-900 border-b-2 border-amber-500 w-fit pb-1">
                            Get in Touch
                        </h6>
                        <div className="space-y-5 text-sm text-gray-600 font-medium">
                            <div className="flex items-start">
                                <span className="mr-3 p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                    <FaMapMarkerAlt />
                                </span>
                                <p className="leading-snug">
                                    Maganlal Chikki Products Pvt Ltd<br/>
                                    <span className="text-gray-400 text-xs font-normal">Shed No. 49A & B, Lonavala 410401 Dist. Pune</span>
                                </p>
                            </div>

                            <a href="mailto:sales@maganlalchikki.in" className="flex items-center hover:text-amber-600 transition-colors group">
                                <span className="mr-3 p-2 bg-amber-100 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shrink-0">
                                    <FaEnvelope />
                                </span>
                                sales@maganlalchikki.in
                            </a>

                            <div className="flex items-start">
                                <span className="mr-3 p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                    <FaPhoneAlt />
                                </span>
                                <div className="space-y-1">
                                    <p className="font-black text-gray-900 text-sm">+91 76665 30969</p>
                                    <p className="text-xs text-gray-400">9 AM To 6 PM | Thursday Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 py-8 text-center text-[10px] tracking-[0.2em] border-t border-amber-200 uppercase font-black">
                <span className="text-gray-400">© 2026 Crafted with Passion by</span>
                <NavLink className="ml-2 text-amber-600 hover:text-amber-700 transition-colors" to="/">
                    MAGANLAL CHIKKI PVT LTD.
                </NavLink>
            </div>
        </footer>
    );
}