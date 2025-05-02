"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import ProductCard from "@/components/productCard";
import ProductModal from "@/components/productModal";
import LoadingSpinner from "@/components/loadingSpinner";

const categories = [
    { key: "featured", label: "Featured", code: 0 },
    { key: "seasonal", label: "Seasonal", code: 1 },
    { key: "milkTea", label: "Milk Tea", code: 2 },
    { key: "fruitTea", label: "Fruit Tea", code: 3 },
    { key: "snacks", label: "Snacks", code: 4 },
];

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState("");
    const [activeItem, setActiveItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("featured");

    const categorizedItems = useMemo(() => {
        const result = {};
        categories.forEach(cat => {
            result[cat.key] = menuItems.filter(item => item.category === cat.code);
        });
        return result;
    }, [menuItems]);

    const handleItemClick = useCallback((item) => {
        setActiveItem(item);
    }, []);

    const handleCategoryClick = useCallback((e, categoryKey) => {
        e.preventDefault();
        setActiveCategory(categoryKey);
        const element = document.getElementById(categoryKey);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        const fetchMenuItems = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/menu", {
                    cache: 'force-cache', // Use NextJS cache for this request
                });
                if (!res.ok) {
                    const { message } = await res.json();
                    throw new Error(message || "Failed to fetch menu items.");
                }
                const data = await res.json();
                setMenuItems(data);
            } catch (err) {
                console.error("Error fetching menu items:", err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    return (
        <div className="container mx-auto p-4">
            {activeItem && <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />}

            <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="float-right">
                    <div className="py-2 md:px-2">
                        <nav className="flex flex-wrap gap-2 md:gap-4">
                            {categories.map((cat) => (
                                <a
                                    key={cat.key}
                                    href={`#${cat.key}`}
                                    data-target={`#${cat.key}`}
                                    className={`tab-btn focus:ring-4 shadow-md ${activeCategory === cat.key ? 'bg-teal text-white' : ''}`}
                                    onClick={(e) => handleCategoryClick(e, cat.key)}
                                >
                                    {cat.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-neutral-50 mb-8 pb-16 rounded-lg shadow-md">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <LoadingSpinner size={32} className="mr-3" />
                        <p>Loading menu items...</p>
                    </div>
                ) : (
                    categories.map((cat) => {
                        const items = categorizedItems[cat.key] || [];
                        return (
                            <div key={cat.key} id={cat.key}>
                                <h1 className="my-8 text-center text-2xl font-bold">{cat.label}</h1>
                                {items.length === 0 ? (
                                    <p className="text-center text-neutral-500">No items available in this category.</p>
                                ) : (
                                    <div className="productSection grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {items.map((item) => (
                                            <ProductCard
                                                key={item._id}
                                                item={item}
                                                onClick={handleItemClick}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}
