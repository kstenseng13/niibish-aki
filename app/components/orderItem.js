import { useState, useEffect } from 'react';
import { useCart } from '../context/cartContext';
import Image from 'next/image';
import { useItemCalculations } from '@/hooks/useItemCalculations';

export default function OrderItem({ orderItem }) {
    const [isRemoving, setIsRemoving] = useState(false);
    const [quantity, setQuantity] = useState(orderItem.quantity || 1);
    const { productImages, removeItemFromCart, updateItemQuantity, cartItems, setItemForEdit } = useCart();
    const { calculateSizeUpcharge } = useItemCalculations();

    // Calculate the price with size upcharge
    const getPriceWithSizeUpcharge = () => {
        if (orderItem.category === 4) {
            return orderItem.price || 0;
        }

        const sizeUpcharge = calculateSizeUpcharge(orderItem.size);
        return orderItem.price + sizeUpcharge;
    };

    useEffect(() => {
        const currentItem = cartItems.find(item => item.cartItemId === orderItem.cartItemId);
        if (currentItem && currentItem.quantity !== quantity) {
            setQuantity(currentItem.quantity);
        }
    }, [cartItems, orderItem.cartItemId, quantity]);

    const updateQuantity = (newQuantity) => {
        const validQuantity = Math.max(1, newQuantity);
        setQuantity(validQuantity);
        updateItemQuantity(orderItem.cartItemId, validQuantity);
    };

    const handleRemoveItem = async () => {
        if (isRemoving) return;
        setIsRemoving(true);
        try {
            await removeItemFromCart(orderItem.cartItemId);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        } finally {
            setIsRemoving(false);
        }
    };

    const handleEditItem = () => {
        setItemForEdit(orderItem.cartItemId);
    };

    const renderAddInItem = (addIn, index) => {
        const addInName = typeof addIn === 'object' ? addIn.name : addIn;
        const addInPrice = typeof addIn === 'object' ? addIn.price : 0;

        let amountText = '';
        if (typeof addIn === 'object' && addIn.amount !== undefined) {
            if (addIn.amount === 0.5) amountText = ', Easy';
            else if (addIn.amount === 1) amountText = ', Regular';
            else if (addIn.amount === 1.5) amountText = ', Extra';
            else amountText = `, ${addIn.amount}`;
        }

        return (
            <div key={`${orderItem.itemId}-addin-${index}`} className="flex justify-between">
                <div className="pl-4">
                    <span>• {addInName}</span>
                    <span className="text-neutral-500">{amountText}</span>
                </div>
                <p className="text-right min-w-[45px]">$ {addInPrice.toFixed(2)}</p>
            </div>
        );
    };

    return (
        <section className="m-2 lg:mt-8 lg:mx-12 ml-0 flex flex-wrap bg-white p-2 md:p-4 rounded-lg shadow-md" id="orderSummaryItem">
            <div className="m-2 lg:m-6 inline-block align-top relative w-28 h-28 lg:w-36 lg:h-36">
                <Image className="object-cover rounded-md" src={orderItem.imagePath || (orderItem.itemId && productImages[orderItem.itemId])} alt={orderItem.altText} fill />
            </div>
            <div className="mx-0 md:mx-4 m-4 w-auto grow flex flex-col">
                <div className="flex flex-nowrap">
                    <div className="grow">
                        <span className="text-lg xl:text-2xl font-semibold">
                            {orderItem.category !== 4 && orderItem.type ? `${orderItem.type} ${orderItem.name}` : orderItem.name}
                        </span>
                    </div>
                    <div className="grow pt-1 flex justify-end gap-2">
                        {parseInt(orderItem.category, 10) !== 4 && (
                            <button type="button" className="hover:cursor-pointer" onClick={handleEditItem}>
                                <Image src="/edit.svg" alt="Edit item" width={20} height={20} className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="sr-only">Edit item</span>
                            </button>
                        )}
                        <button type="button" className="hover:cursor-pointer" onClick={handleRemoveItem} disabled={isRemoving}>
                            <Image src="/x.svg" alt="Delete item" width={20} height={20} className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span className="sr-only">Delete item</span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-between">
                    <p className="font-medium">{orderItem.category !== 4 && orderItem.size ? `${orderItem.size}` : ""}</p>
                    <p>$ {parseFloat(orderItem.price).toFixed(2)}</p>
                </div>

                {orderItem.addIns?.length > 0 && (
                    <div className="mt-2">
                        <p className="font-medium">Add-ins:</p>
                        {orderItem.addIns.map(renderAddInItem)}
                    </div>
                )}

                <div className="mt-auto pt-2 border-t border-neutral-300 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 w-1/2">
                            <button onClick={() => updateQuantity(quantity - 1)}
                                className="w-6 h-6 p-2 flex items-center justify-center rounded-full border border-neutral-300 text-xl hover:cursor-pointer">−</button>
                            <input type="number" value={quantity} onChange={(e) => updateQuantity(Number(e.target.value))} min={1} className="w-12 text-center p-1 border rounded" />
                            <button onClick={() => updateQuantity(quantity + 1)}
                                className="w-6 h-6 p-2 flex items-center justify-center rounded-full border border-neutral-300 text-xl hover:cursor-pointer">+</button>
                        </div>
                    </div>
                    <p className="font-bold text-xl">$ {parseFloat(orderItem.totalPrice || orderItem.price || 0).toFixed(2)}</p>
                </div>
            </div>
        </section>
    );
}
