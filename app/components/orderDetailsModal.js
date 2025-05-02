"use client";

import { useState } from 'react';
import { usePickupTime } from '@/hooks/usePickupTime';
import { useCart } from '@/context/cartContext';
import { useItemCalculations } from '@/hooks/useItemCalculations';
import LoadingSpinner from './loadingSpinner';

function renderAddIns(item) {
    if (!item.addIns || item.addIns.length === 0) {
        return null;
    }

    return (
        <div className="ml-4 text-sm">
            {item.addIns.map((addIn, index) => {
                let amountText = '';
                if (typeof addIn === 'object') {
                    if (addIn.amount === 0.5) amountText = 'Easy';
                    else if (addIn.amount === 1) amountText = 'Regular';
                    else if (addIn.amount === 1.5) amountText = 'Extra';
                }

                const addInName = typeof addIn === 'object' ? addIn.name : addIn;
                const addInPrice = typeof addIn === 'object' ? addIn.price : 0;

                const addInKey = `${item.cartItemId || item._id || index}-${addInName}-${amountText}-${index}`;

                return (
                    <div key={addInKey} className="flex justify-between">
                        <span>• {addInName}{amountText ? `, ${amountText}` : ''}</span>
                        <span className="min-w-[50px] text-right">+ $ {addInPrice.toFixed(2)}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default function OrderDetailsModal({ order, onClose }) {
    const { formattedTime: pickupTime, isToday } = usePickupTime();
    const { addItemToCart } = useCart();
    const { prepareCartItem } = useItemCalculations();

    const [isReordering, setIsReordering] = useState(false);
    const [notification, setNotification] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleReorder = async (items) => {
        if (!items || items.length === 0) return;

        setIsReordering(true);
        setProgress(0);
        setNotification(null);
        let successCount = 0;

        try {
            const itemsWithIds = items.filter(item => item.itemId);

            if (itemsWithIds.length === 0) {
                setNotification({
                    type: 'error',
                    message: 'No valid items to add to cart'
                });
                setIsReordering(false);
                return;
            }

            const fetchPromises = itemsWithIds.map(item =>
                fetch(`/api/menu/${item.itemId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch menu item ${item.itemId}`);
                        }
                        return response.json();
                    })
                    .then(menuItem => ({ menuItem, originalItem: item }))
                    .catch(error => {
                        console.error(error);
                        return null;
                    })
            );

            // Wait for all fetch operations to complete
            const results = await Promise.all(fetchPromises);
            const validResults = results.filter(result => result !== null);

            for (let i = 0; i < validResults.length; i++) {
                const { menuItem, originalItem } = validResults[i];

                try {
                    const customizations = {
                        quantity: originalItem.quantity || 1,
                        type: originalItem.type,
                        size: originalItem.size,
                        addIns: originalItem.addIns
                    };

                    const newCartItem = prepareCartItem(menuItem, customizations);
                    await addItemToCart(newCartItem);
                    successCount++;

                    setProgress(Math.round(((i + 1) / validResults.length) * 100));
                } catch (error) {
                    console.error(`Error processing item ${originalItem.itemId}:`, error);
                }
            }

            if (successCount > 0) {
                onClose();
            } else {
                setNotification({
                    type: 'error',
                    message: 'Failed to add items to cart. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error reordering items:', error);
            setNotification({
                type: 'error',
                message: 'An error occurred while adding items to cart.'
            });
        } finally {
            setIsReordering(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-backdrop') {
            onClose();
        }
    };

    if (!order) return null;

    const subtotal = order.bill?.subtotal || 0;
    const tax = order.bill?.tax || 0;
    const tipAmount = order.bill?.tip || 0;
    const tipPercentage = order.tipPercentage || 0;
    const total = parseFloat(subtotal) + parseFloat(tax) + parseFloat(tipAmount);

    const items = order.items?.map(item => ({
        ...item,
        cartItemId: item.itemId || `item-${Math.random().toString(36).substring(2, 9)}`
    })) || [];

    return (
        <div
            id="modal-backdrop"
            className="modal-backdrop"
            onClick={handleOutsideClick}
        >
            <div className="modal-content max-w-3xl" role="dialog" aria-modal="true">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Order Details</h2>
                        <button
                            onClick={onClose}
                            className="text-neutral-500 hover:text-neutral-800 transition-colors"
                            disabled={isReordering}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {isReordering && (
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-teal h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-center mt-2">
                                <LoadingSpinner size={16} className="mr-2" />
                                <p className="text-sm text-gray-600">Adding items to cart...</p>
                            </div>
                        </div>
                    )}

                    {notification && (
                        <div className={`mb-4 p-3 rounded-md ${notification.type === 'error'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-green-100 text-green-800 border border-green-300'
                            }`}>
                            <div className="flex items-center">
                                {notification.type === 'error' ? (
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span>{notification.message}</span>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="bg-neutral-100 rounded-lg p-3 flex-1">
                                <p className="text-sm text-neutral-500">Order ID</p>
                                <p className="font-medium">{order._id.toString().substring(0, 12)}...</p>
                            </div>
                            <div className="bg-neutral-100 rounded-lg p-3 flex-1">
                                <p className="text-sm text-neutral-500">Date</p>
                                <p className="font-medium">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="bg-neutral-100 rounded-lg p-3 flex-1">
                                <p className="text-sm text-neutral-500">Status</p>
                                <p className="font-medium">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        {order.status || 'Complete'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Pickup Details</h3>
                            <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg">
                                <p><span className="font-medium">Location:</span> 22 3rd Street S. Grand Forks, ND 58201</p>
                                <p><span className="font-medium">Time:</span> {pickupTime}{isToday ? ' (Today)' : ''}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-4">Order Items</h3>
                            <div className="border border-neutral-200 rounded-lg overflow-hidden">
                                {items.map((item, index) => (
                                    <div
                                        key={`modal-item-${item.cartItemId || index}`}
                                        className={`p-4 ${index !== items.length - 1 ? 'border-b border-neutral-200' : ''}`}
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                {item.category !== 4 ? (
                                                    <>
                                                        {item.size} {item.type} {item.name}
                                                    </>
                                                ) : (
                                                    <>{item.name}</>
                                                )}
                                                {item.quantity > 1 && <span className="text-sm text-neutral-600 ml-1">(x{item.quantity})</span>}
                                            </span>
                                            <div className="text-right">
                                                <div>$ {typeof item.basePrice === 'object' && item.basePrice.$numberDecimal ?
                                                    parseFloat(item.basePrice.$numberDecimal).toFixed(2) :
                                                    parseFloat(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                            
                                        </div>
                                        {renderAddIns(item)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-neutral-200 pt-4">
                            <div className="flex justify-between mb-2">
                                <span>Subtotal:</span>
                                <span>$ {parseFloat(subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tax:</span>
                                <span>$ {parseFloat(tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tip {tipPercentage ? `(${tipPercentage}%)` : ''}:</span>
                                <span>$ {parseFloat(tipAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-neutral-200">
                                <span>Total:</span>
                                <span>$ {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => handleReorder(items)}
                            disabled={isReordering}
                            className="actionButton flex items-center justify-center min-w-[120px] disabled:bg-neutral-400 disabled:cursor-not-allowed"
                        >
                            {isReordering ? (
                                <>
                                    <LoadingSpinner size={16} className="-ml-1 mr-2" />
                                    Adding...
                                </>
                            ) : 'Add to Cart'}
                        </button>
                        <button
                            onClick={onClose}
                            className="actionButton"
                            disabled={isReordering}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
