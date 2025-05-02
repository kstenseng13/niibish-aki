"use client";

import { useCart } from '../context/cartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPreview() {
    const { formattedItems, subtotal } = useCart();

    const itemsWithImages = formattedItems.map(item => ({
        ...item,
        imagePath: item.imagePath
    }));

    return (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-neutral-200">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Your Cart</h3>

                {itemsWithImages.length > 0 ? (
                    <>
                        <div className="max-h-60 overflow-y-auto">
                            {itemsWithImages.slice(0, 3).map((item, index) => (
                                <div key={`${item.cartItemId || item.itemId}-${index}`} className="flex items-center py-2 border-b border-neutral-100">
                                    <div className="w-12 h-12 relative mr-3">
                                        <Image
                                            src={"/images/menu/" + item.imagePath}
                                            alt={item.name || "Product"}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-neutral-500">
                                            {item.size} {item.quantity > 1 ? `x${item.quantity}` : ''} {item.addIns?.length > 0 ? `• ${item.addIns.length} add-ins` : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">${item.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}

                            {itemsWithImages.length > 3 && (
                                <p className="text-xs text-center mt-2 text-neutral-500">
                                    +{itemsWithImages.length - 3} more items(s)
                                </p>
                            )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-neutral-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Total</span>
                                <span className="text-sm font-bold">${subtotal}</span>
                            </div>

                            <Link href="/cart" className="block w-full actionButton transition">
                                View Cart
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-neutral-500 mb-3">Your cart is empty</p>
                        <Link href="/menu" className="actionButton transition font-medium">
                            Browse Menu
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

