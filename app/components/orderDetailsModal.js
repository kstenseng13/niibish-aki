"use client";

import { useEffect } from 'react';
import { usePickupTime } from '@/hooks/usePickupTime';

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
                        <span>+ $ {addInPrice.toFixed(2)}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default function OrderDetailsModal({ order, onClose }) {
    const { formattedTime: pickupTime, isToday } = usePickupTime();

    // Format date
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

    // Close modal when Escape key is pressed
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        // Prevent scrolling of the body when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

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
        cartItemId: item.itemId || `item-${Math.random().toString(36).substring(2, 9)}`,
        type: item.type || 'tea',
        name: item.name || 'Tea',
        size: item.size || 'Medium',
        totalPrice: item.price * (item.quantity || 1)
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
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

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
                                                {item.size} {item.type} {item.name}
                                                {item.quantity > 1 && <span className="text-sm text-neutral-600 ml-1">(x{item.quantity})</span>}
                                            </span>
                                            <span>$ {(item.totalPrice || (item.price * (item.quantity || 1))).toFixed(2)}</span>
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

                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="actionButton"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
