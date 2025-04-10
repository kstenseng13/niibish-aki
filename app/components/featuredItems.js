"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/productCard";

export default function FeaturedItems() {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFeaturedItems = async () => {
            try {
                const response = await fetch("/api/menu/featured");
                if (!response.ok) {
                    const { message } = await response.json();
                    throw new Error(message || "Failed to fetch featured items.");
                }
                const data = await response.json();
                setFeaturedItems(data);
            } catch (err) {
                console.error("Error fetching featured items:", err.message);
                setError(err.message);
            }
        };

        fetchFeaturedItems();
    }, []);

    return (
        <div aria-label="Featured Products">
            <div id="featuredProductsSection" className="productSection justify-center
            bg-[linear-gradient(to_bottom,rgba(255,190,130,0.9),rgba(255,210,160,0.8)),url('https://e7.pngegg.com/pngimages/202/564/png-transparent-seamless-floral-pattern.png')]" aria-live="polite">
                <h2 className="text-center mt-4">Explore Our Featured Products</h2>
                <div className="container mx-auto p-4">
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    <div className="productSection grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {featuredItems.map((item) => (
                            <ProductCard key={item._id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>


    );
}
