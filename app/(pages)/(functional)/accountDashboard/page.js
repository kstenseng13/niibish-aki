"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/userContext";
import AccountSettings from "./AccountSettings";
import OrderHistory from "./OrderHistory";
import UserAddress from "./UserAddress";
import Favorites from "./Favorites";

//TODO USE PARALLEL ROUTES FOR LOADING: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes

export default function AccountDashboard() {
    const { user, isLoggedIn, loading } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Account Settings");

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Redirecting...</p>
            </div>
        );
    }

    const tabs = [
        { name: "Account Settings", component: <AccountSettings /> },
        { name: "Orders", component: <OrderHistory /> },
        { name: "Address", component: <UserAddress /> },
        { name: "Favorites", component: <Favorites /> }
    ];

    return (
        <div>
            <div className="w-full backgroundWhiteSmoke">
                <div className="border-b border-amber-600 p-2 mx-8 my-4 ">
                    <h1 className="text-xl font-semibold">Hello, {user.username}</h1>
                </div>
                <div className="flex flex-col md:flex-row w-full mb-8">
                    <div className="w-full md:w-1/4 p-6">
                        <div className="flex md:flex-col gap-2 md:gap-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`w-full text-left px-4 py-4 transition 
                                        ${activeTab === tab.name ? "border-l-4 border-orange-700/50 font-semibold" : "border-l-4 border-transparent"}
                                        hover:bg-orange-700/10`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-full min-h-[500px] shadow-md shadow-orange-700/10 p-6 md:mr-8 md:border-1 md:border-orange-700/50">
                        {tabs.find(tab => tab.name === activeTab)?.component}
                    </div>
                </div>
            </div>

            <div className="bg-matchaDark h-12"></div>
        </div>
    );
};