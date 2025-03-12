"use client";

import { useEffect } from 'react';
import { toggleNavbarMenu } from '../../utils/navbarToggle';

export default function Navbar() {
    useEffect(() => {
        toggleNavbarMenu();
    }, []);

    return (
        <div>
            <nav className="navBarContainer">
                <div className="m-auto w-96 basis-2/3 ">
                    <div className="ml-4 sentient">
                        <a href="./index.html">
                            <h1>Niibish Aki</h1>
                        </a>
                    </div>
                    <div className="italic ml-20">
                        <span>Tea of the Earth</span>
                    </div>
                </div>
                <div className="navBarMenu lg:hidden hover:text-stone-950" id="navbarMenu">
                    <button id="toggleMenu" aria-expanded="false" aria-controls="menu" aria-label="Toggle Nav Menu">
                        <img src="https://cdn.iconscout.com/icon/free/png-512/free-menu-1768000-1502336.png?f=webp&w=256"
                            alt="Akveo (Creator).(2019, July 30). Free Menu Icon [Digital image]. Retrieved from URL https://iconscout.com/icon/menu-1768000"
                            className="w-10 pr-2"></img>
                    </button>
                </div>
                <div className="hidden navBarMenu lg:block lg:text-xl hover:text-black shadow-md bg-amber-50 hover:bg-amber-50 focus:ring-4 focus:outline-none rounded-lg py-2.5" id="navbarOrder">
                    <a href="/pages/products.html">Order Now</a>
                </div>
                <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarLogin">
                    <a href="/pages/login.html">Login</a>
                </div>
                <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarAboutUs">
                    <a href="/pages/aboutUs.html">About Us</a>
                </div>
                <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarCart">
                    <a href="/pages/cart.html"><img src="https://cdn.iconscout.com/icon/free/png-512/free-shopping-cart-icon-download-in-svg-png-gif-file-formats--trolley-online-user-interface-pack-icons-1502238.png?f=webp&w=256"
                        alt="Akveo (Creator).(2019, July 30). Free Shopping Cart Icon [Digital image]. Retrieved from URL https://iconscout.com/icon/free/png-512/free-shopping-cart-icon-download-in-svg-png-gif-file-formats--trolley-online-user-interface-pack-icons-1502238.png?f=webp&w=256" className="ml-4 w-8 h-8"></img>
                    </a>
                </div>
            </nav>
            <nav id="mobileMenu" className="hidden lg:hidden w-full bg-whiteSmoke">
                <ul>
                    <li className="text-2xl py-8 mx-4 font-semibold border-b border-gray-300"><a href="/pages/products.html">Order Now</a></li>
                    <li className="text-2xl py-8 mx-4 font-semibold border-b border-gray-300"><a href="/pages/login.html">Login</a></li>
                    <li className="text-2xl py-8 mx-4 font-semibold border-b border-gray-300"><a href="/pages/aboutUs.html">About Us</a></li>
                    <li className="text-2xl py-8 mx-4 font-semibold border-b border-gray-300"><a href="/pages/cart.html">Cart</a></li>
                </ul>
            </nav>
        </div>
    );
}
