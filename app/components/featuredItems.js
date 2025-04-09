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
        <div className="container mx-auto p-4">
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="productSection grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {featuredItems.map((item) => (
                    <ProductCard key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
}
