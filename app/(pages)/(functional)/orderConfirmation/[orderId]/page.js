"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import FeaturedItems from "@/components/featuredItems";
import OrderDetails from "@/components/orderDetails";
import Link from 'next/link';
import Image from 'next/image';

export default function OrderConfirmation({ params }) {
    // Use React.use() to unwrap the params promise
    const resolvedParams = use(params);
    const orderId = resolvedParams.orderId;
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
                <div className="w-full lg:w-7/12 lg:mr-8">
                    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                        <div className="mb-8">
                            <div className="inline-block mb-4">
                                <Image src="/checkmark.svg" alt="checkmark" width={24} height={24} className="mr-1 md:mr-4 w-12 h-12" />
                            </div>
                            <div className="inline-block mb-4">
                                <p className="text-neutral-600 mt-2">Order #{orderId}</p>
                                <h2 className="mb-2">Thank you, {order.customerInfo?.firstName || 'Guest'}!</h2>
                            </div>
                            <div className="pb-4 mb-4 border-b border-neutral-300">
                                <p className="text-lg md:text-xl">Your order is confirmed.</p>
                                <p className="text-lg md:text-xl">We have accepted your order and we are getting it ready.</p>
                            </div>
                            <div className="pb-4 mb-4 border-b border-neutral-300">
                                {order.customerInfo.address?.line1 ? (
                                    <>
                                        <p className="font-semibold mb-1">Billing Address:</p>
                                        <p>{order.customerInfo.firstName + ' ' + order.customerInfo.lastName}</p>
                                        <p>{order.customerInfo.address.line1}</p>
                                        {order.customerInfo.address.line2 && <p>{order.customerInfo.address.line2}</p>}
                                        <p>
                                            {[order.customerInfo.address.city, order.customerInfo.address.state, order.customerInfo.address.zipcode]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </>
                                ) : ("")}
                            </div>
                            <div >
                                <p className="font-semibold mb-1">Payment Method:</p>
                                <p>Pay at Store</p>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => router.push('/menu')}
                                className="actionButton"> Return to Menu
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-4/12 mt-8 lg:mt-0">
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
                </div>
            </main>
            <div className='bg-teal h-12'></div>
            <FeaturedItems />
        </div>
    );
}
