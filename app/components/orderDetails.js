"use client";

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

                //TODO: check if this is necessary, too
                // Create a more reliable key using item ID and add-in name
                const addInKey = `${item.cartItemId}-${addInName}-${amountText}-${index}`;

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

export default function OrderDetails({ items, subtotal, tax, tipAmount, tipPercentage, total }) {
    const { formattedTime: pickupTime, isToday } = usePickupTime();

    return (
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
                {items.map((item, index) => (
                    <div key={`total-item-${item.cartItemId || index}`} className="mb-3 ml-4">
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
                            <span>$ {(item.totalPrice || (item.price * item.quantity)).toFixed(2)}</span>
                        </div>
                        {renderAddIns(item)}
                    </div>
                ))}
            </div>
            <div className="border-t border-neutral-300 pt-3 mb-2 ml-4">
                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax:</span>
                    <span>$ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tip {tipPercentage ? `(${tipPercentage}%)` : ''}:</span>
                    <span>$ {parseFloat(tipAmount).toFixed(2)}</span>
                </div>
            </div>
            <div className="border-t border-neutral-300 my-3 pt-3 ml-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>$ {parseFloat(total).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
