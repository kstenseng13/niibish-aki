"use client"

import { useState, useEffect } from "react";
import OrderItem from "../../components/orderItem";

export default function Cart() {
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        setOrderItems([
            {
                name: "Medium Iced Matcha Milk Tea",
                imagePath: "/images/matcha.png", // Adjust path
                altText: "Iced Matcha Milk Tea",
                addIns: ["Original Boba, Regular", "Strawberry Puree, Regular"],
                price: 5.50,
                extraCharges: [0.50, 1.00],
                totalPrice: 7.00
            },
            {
                name: "Large Taro Milk Tea",
                imagePath: "/images/taro.png",
                altText: "Taro Milk Tea",
                addIns: ["Honey Boba, Large", "Taro Syrup"],
                price: 6.00,
                extraCharges: [0.75, 1.25],
                totalPrice: 8.00
            }
        ]);
    }, []);

    return (
        <div>
            <main className="bg-whiteSmoke justify-center flex flex-wrap w-full p-8">
                <div className="w-full lg:w-7/12 lg:mr-8">
                    <h2>Order Summary</h2>
                    <div id="orderSummaryItemsSection" aria-live="polite">
                        {orderItems.map((item, index) => (
                            <OrderItem key={index} orderItem={item} />
                        ))}
                    </div>
                </div>
                <div className="w-full mt-4 lg:mt-0 lg:w-[33%] inline-block h-full">
                    <h2>Order Details</h2>
                    <div className="mt-2 lg:mt-12">
                        <div id="orderSummaryDetails">
                            <div>
                                <p>Ready at:</p>
                                <div className="border border-stone-800 bg-stone-200 w-full mt-2">
                                    123 Store Ave S, SomeCity, MN 12345-6789
                                </div>
                            </div>
                            <div className="pt-4">
                                <p>For:</p>
                                <div className="border border-stone-800 bg-stone-200 w-full mt-2">
                                    Pickup - 5:30 PM (ASAP)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
