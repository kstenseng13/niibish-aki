"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePickupTime } from '@/hooks/usePickupTime';
import FeaturedItems from "@/components/featuredItems";
import OrderDetails from "@/components/orderDetails";
import Link from 'next/link';

export default function orderConfirmation({ params }) {
    const { orderId } = params;
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setIsLoading(true);

                try {
                    const response = await fetch(`/api/order/${orderId}`);
                    const data = await response.json();
                    setOrder(data);
                } catch (apiErr) {
                    console.error('API fetch failed:', apiErr);
                    setError('Unable to retrieve your order details. Please try again later..');
                }
            } catch (err) {
                console.error('Error in order confirmation:', err);
                setError('Unable to load order details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        } else {
            setError('No order ID provided');
            setIsLoading(false);
        }
    }, [orderId]);

    // Format items for display
    const formatItems = (items) => {
        if (!items || !Array.isArray(items)) return [];

        return items.map(item => ({
            ...item,
            imagePath: item.imagePath || `/images/menu/${item.type || 'tea'}.jpg`,
            totalPrice: item.price * (item.quantity || 1),
            cartItemId: item.itemId || `item-${Math.random().toString(36).substring(2, 9)}`,
            type: item.type || 'tea',
            name: item.name || 'Tea',
            size: item.size || 'Medium'
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-whiteSmoke flex items-center justify-center">
                <p className="text-xl">Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-whiteSmoke flex flex-col items-center justify-center p-4">
                <p className="text-xl text-red-600 mb-4">{error}</p>
                <div className="flex flex-col space-y-4">
                    <button onClick={() => router.push('/menu')} className="actionButton" >
                        Return to Menu
                    </button>
                    <Link href="/cart" className="text-teal hover:underline text-center">
                        Return to Cart
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <main className="justify-center flex flex-wrap w-full p-8 min-h-[calc(100vh-12rem)]" role="main">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="bg-whiteSmoke p-8 rounded-lg shadow-md mb-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-teal mb-2">Order Complete!</h1>
                            <p className="text-xl">Thank you for your order</p>
                            <p className="text-neutral-600 mt-2">Order #{orderId}</p>
                        </div>

                        {order ? (
                            <OrderDetails
                                items={formatItems(order.items)}
                                subtotal={order.bill?.subtotal || 0}
                                tax={order.bill?.tax || 0}
                                tipAmount={order.bill?.tip || 0}
                                tipPercentage={order.tipPercentage || 0}
                                total={parseFloat(order.bill?.subtotal || 0) + parseFloat(order.bill?.tax || 0) + parseFloat(order.bill?.tip || 0)}
                            />
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <p className="text-center text-neutral-600">Order details not available</p>
                            </div>
                        )}

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => router.push('/menu')}
                                className="actionButton"
                            >
                                Return to Menu
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <div className='bg-teal h-12'></div>
            <FeaturedItems />
        </div>
    );
}
