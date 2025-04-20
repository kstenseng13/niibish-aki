"use client"

import { useState, useEffect } from 'react';
import { useCart } from '../../../context/cartContext';
import { usePickupTime } from '@/hooks/usePickupTime';
import FeaturedItems from "@/components/featuredItems";
import OrderItem from "@/components/orderItem";
import ProductModal from "@/components/productModal";

// Helper function to render add-ins for an item
function renderAddIns(item) {
    if (!item.addIns || item.addIns.length === 0) {
        return null;
    }

    return (
        <div className="ml-4 text-sm">
            {item.addIns.map((addIn) => {
                // Format add-in amount
                let amountText = '';
                if (typeof addIn === 'object') {
                    if (addIn.amount === 0.5) amountText = 'Easy';
                    else if (addIn.amount === 1) amountText = 'Regular';
                    else if (addIn.amount === 1.5) amountText = 'Extra';
                }

                const addInName = typeof addIn === 'object' ? addIn.name : addIn;
                const addInPrice = typeof addIn === 'object' ? addIn.price : 0;

                // Create a more reliable key using item ID and add-in name
                const addInKey = `${item.cartItemId}-${addInName}-${amountText}`;

                return (
                    <div key={addInKey} className="flex justify-between">
                        <span>• {addInName}{amountText ? `, ${amountText}` : ''}</span>
                        <span>+ ${addInPrice.toFixed(2)}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default function Cart() {
    const [activeItem, setActiveItem] = useState(null);

    const {
        isLoading,
        isCheckingOut,
        subtotal,
        tax,
        tipAmount,
        total,
        formattedItems,
        processCheckout,
        tipPercentage,
        itemToEdit
    } = useCart();

    const { formattedTime: pickupTime, isToday } = usePickupTime();

    // If an item is being edited, find the corresponding menu item
    useEffect(() => {
        if (itemToEdit) {
            const menuItem = {
                _id: itemToEdit.itemId,
                name: itemToEdit.name,
                price: itemToEdit.price,
                image: itemToEdit.imagePath.replace('/images/menu/', ''),
                alt: itemToEdit.altText,
                category: itemToEdit.category || (itemToEdit.addIns ? 2 : 4)
            };
            setActiveItem(menuItem);
        } else {
            setActiveItem(null);
        }
    }, [itemToEdit]);

    const itemsWithImages = formattedItems.map(item => ({
        ...item,
        imagePath: "/images/menu/" + item.imagePath
    }));

    return (
        <div>
            {activeItem && <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />}
            <main className="bg-whiteSmoke justify-center flex flex-wrap w-full p-8 min-h-[calc(100vh-12rem)]" role="main">
                <div className="w-full lg:w-7/12 lg:mr-8">
                    <h2>Order Summary</h2>
                    <div id="orderSummaryItemsSection" aria-live="polite">
                        {isLoading || isCheckingOut ? (
                            <p>{isCheckingOut ? 'Processing your order...' : 'Loading cart items...'}</p>
                        ) : itemsWithImages.length > 0 ? (
                            itemsWithImages.map((item, index) => (
                                <OrderItem key={`item-${item.cartItemId || index}`} orderItem={item} />
                            ))
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-xl">Your cart is empty</p>
                                <a href="/menu" className="inline-block mt-4 px-6 py-2 actionButton">
                                    Browse Menu
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {itemsWithImages.length > 0 && (
                    <div className="w-full lg:w-4/12 mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                            <h4 className="mb-4">Pickup Details</h4>
                            <div className='mb-4 ml-4'>
                                <span>Ready At:</span>
                                <p className="bg-orange-400/30 border border-orange-800/40 rounded p-0.5">22 3rd Street S. Grand Forks, ND 58201</p>
                            </div>
                            <div className='mb-4 ml-4'>
                                <span>For:</span>
                                <p className="bg-orange-400/30 border border-orange-800/40 rounded p-0.5">Pickup - {pickupTime}{isToday ? ' (Today)' : ''}</p>
                            </div>
                            <div className="mb-4">
                                <h4 className="my-4">Total</h4>
                                {itemsWithImages.map((item, index) => (
                                    <div key={`total-item-${item.cartItemId || index}`} className="mb-3 ml-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                {item.size} {item.type} {item.name}
                                                {item.quantity > 1 && <span className="text-sm text-gray-600 ml-1">(x{item.quantity})</span>}
                                            </span>
                                            <span>$ {(item.totalPrice || (item.price * item.quantity)).toFixed(2)}</span>
                                        </div>
                                        {renderAddIns(item)}
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-neutral-300 pt-3 mb-2 ml-4">
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Tax:</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Tip ({tipPercentage}%):</span>
                                    <span>${tipAmount}</span>
                                </div>
                            </div>
                            <div className="border-t border-neutral-300 my-3 pt-3 ml-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                            <button
                                className="w-full mt-4 actionButton transition"
                                onClick={async () => {
                                    const result = await processCheckout();
                                    if (result.success) {
                                        window.location.href = `/order-confirmation/${result.orderId}`;
                                    }
                                }} disabled={isCheckingOut} >
                                Proceed to Checkout </button>
                        </div>
                    </div>
                )}
            </main>
            <div className='bg-teal h-12'></div>
            <FeaturedItems />
        </div>
    );
}