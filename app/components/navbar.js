"use client";

import { useEffect } from 'react';
import { useUser } from '../context/userContext';
import { toggleNavbarMenu } from '../_utils/navbarToggle';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const { isLoggedIn, logout } = useUser(); // Get login state and logout function

    useEffect(() => {
        toggleNavbarMenu();
    }, []);

    return (
        <div>
            <nav className="navBarContainer">
                <div className="m-auto w-96 basis-2/3 ">
                    <div className="ml-4 sentient">
                        <Link href="/">
                            <h1>Niibish Aki</h1>
                        </Link>
                    </div>
                    <div className="italic ml-20">
                        <span>Tea of the Earth</span>
                    </div>
                </div>
                <div className="navBarMenu lg:hidden hover:text-stone-950" id="navbarMenu">
                    <button id="toggleMenu" aria-expanded="false" aria-controls="menu" aria-label="Toggle Nav Menu">
                        <Image width={24} height={24} src="https://cdn.iconscout.com/icon/free/png-512/free-menu-1768000-1502336.png?f=webp&w=256"
                            alt="Menu Icon"
                            className="w-10 pr-2 hover:cursor-pointer"/>
                    </button>
                </div>
                <div className="hidden navBarMenu lg:block lg:text-xl hover:text-black shadow-md bg-orange-50 hover:bg-orange-100 focus:ring-4 focus:outline-none rounded-lg py-2.5" id="navbarOrder">
                    <Link href="/menu">Order Now</Link>
                </div>
                {!isLoggedIn && (
                    <>
                        <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarLogin">
                            <Link href="/login">Login</Link>
                        </div>
                        <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarAboutUs">
                            <Link href="/aboutUs">About Us</Link>
                        </div>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarAccount">
                            <Link href="/accountDashboard">Account</Link>
                        </div>
                        <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarLogout">
                            <button onClick={logout} className="bg-transparent border-none text-inherit cursor-pointer">
                                Logout
                            </button>
                        </div>
                    </>
                )}
                <div className="hidden navBarMenu lg:block lg:text-xl hover:text-stone-950" id="navbarCart">
                    <Link href="/cart">
                        <Image width={24} height={24} src="https://cdn.iconscout.com/icon/free/png-512/free-shopping-cart-icon-download-in-svg-png-gif-file-formats--trolley-online-user-interface-pack-icons-1502238.png?f=webp&w=256"
                            alt="Shopping Cart Icon" className="ml-4 w-8 h-8"/>
                    </Link>
                </div>
            </nav>
            <nav id="mobileMenu" className="hidden lg:hidden w-full bg-whiteSmoke">
                <ul>
                    <li className="text-2xl py-8 px-4 font-semibold border-b border-amber-700/15 hover:bg-amber-700/10">
                        <Link href="/menu" className="block w-full h-full">Order Now</Link>
                    </li>
                    <li className="text-2xl py-8 px-4 font-semibold border-b border-amber-700/15 hover:bg-amber-700/10">
                        <Link href={isLoggedIn ? "/accountDashboard" : "/login"} className="block w-full h-full">
                            {isLoggedIn ? "Account" : "Login"}
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <li className="text-2xl py-8 px-4 font-semibold border-b border-amber-700/15 hover:bg-amber-700/10">
                            <button onClick={logout} className="block w-full h-full text-left">
                                Logout
                            </button>
                        </li>
                    )}
                    {!isLoggedIn && (
                        <li className="text-2xl py-8 px-4 font-semibold border-b border-amber-700/15 hover:bg-amber-700/10">
                            <Link href="/aboutUs" className="block w-full h-full">About Us</Link>
                        </li>
                    )}
                    <li className="text-2xl py-8 px-4 font-semibold border-b border-amber-700/15 hover:bg-amber-700/10">
                        <Link href="/cart" className="block w-full h-full">Cart</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
