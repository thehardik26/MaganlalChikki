import { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutUs" },
    { name: "Contact Us", href: "/contactUs" },
    { name: "Shop", href: "/shop" },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const favItems = useSelector((state) => state.fav.list);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <Disclosure as="nav" className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    <div className="flex shrink-0 items-center">
                        <Link to="/">
                            <img alt="Logo" src="/src/assets/images/web-logo-3.png" className="h-10 w-auto" />
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    classNames(
                                        isActive ? "bg-amber-50 text-amber-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                                    )
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                        <form onSubmit={handleSearch} className="relative flex items-center group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-focus-within:text-amber-600" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-28 sm:w-40 lg:w-48 focus:w-40 sm:focus:w-64 rounded-xl bg-gray-100 border-none py-1.5 pl-9 pr-3 text-xs sm:text-sm text-gray-900 placeholder-gray-500 ring-1 ring-gray-200 focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 outline-none"
                                placeholder="Search..."
                            />
                        </form>

                        <div className="flex items-center gap-1">
                            <NavLink to="/fav" className="relative p-2 text-gray-500 hover:text-amber-600 transition-colors">
                                <HeartIcon className="h-6 w-6" />
                                {favItems?.length > 0 && (
                                    <span className="absolute top-1 right-0.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                        {favItems.length}
                                    </span>
                                )}
                            </NavLink>

                            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-amber-600 transition-colors">
                                <ShoppingBagIcon className="h-6 w-6" />
                                {cartItems?.length > 0 && (
                                    <span className="absolute top-1 right-0.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>

                            <Menu as="div" className="relative ml-2 sm:ml-4">
                                <MenuButton className="flex rounded-xl bg-gray-100 ring-1 ring-gray-200 hover:ring-amber-500 transition-all overflow-hidden">
                                    <img className="h-8 w-8 rounded-xl object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&q=80" alt="User" />
                                </MenuButton>
                                <MenuItems className="absolute right-0 z-10 mt-3 w-48 origin-top-right rounded-xl bg-white border border-gray-100 p-1 shadow-xl focus:outline-none">
                                    <MenuItem>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg">Profile</Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <button className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>

                            <DisclosureButton className="lg:hidden ml-2 p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100">
                                <Bars3Icon className="block h-6 w-6 group-open:hidden" />
                                <XMarkIcon className="hidden h-6 w-6 group-open:block" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            classNames(isActive ? "bg-amber-50 text-amber-600" : "text-gray-600 hover:bg-gray-50", "block rounded-xl px-4 py-3 text-base font-medium")
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </DisclosurePanel>
        </Disclosure>
    )
}