import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "../context/cartContext";

const formatPrice = (price) => {
    return typeof price === "object" && "$numberDecimal" in price
        ? parseFloat(price.$numberDecimal)
        : parseFloat(price);
};

export default function ProductModal({ item, onClose }) {
    const { addItemToCart, isLoading, itemToEdit, updateCartItem, setItemForEdit } = useCart();
    const [type, setType] = useState(itemToEdit?.type || "Iced");
    const [size, setSize] = useState(itemToEdit?.size || "Small");
    const [quantity, setQuantity] = useState(itemToEdit?.quantity || 1);
    const [addIns, setAddIns] = useState([]);
    const [selectedAddIns, setSelectedAddIns] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!itemToEdit;
    const isSnack = item?.category === 4;
    const [menuItem, setMenuItem] = useState(item);

    const handleQuantityChange = (e) => {
        const value = Number(e.target.value);
        if (value > 0) {
            setQuantity(value);
        } else {
            setQuantity(1);
        }
    };

    const validateQuantityOnBlur = (e) => {
        if (Number(e.target.value) < 1) {
            setQuantity(1);
        }
    };

    useEffect(() => {
        const fetchAddIns = async () => {
            try {
                const res = await fetch("/api/menu/add-ins");
                if (!res.ok) throw new Error("Failed to fetch add-ins.");
                const data = await res.json();
                setAddIns(data);

                // If we're in edit mode and have addins, set the selected addins
                if (itemToEdit?.addIns && itemToEdit.addIns.length > 0) {
                    const selectedAddInsMap = {};
                    itemToEdit.addIns.forEach(addIn => {
                        if (addIn.id) {
                            let amountText = "Regular";
                            if (addIn.amount === 0.5) amountText = "Easy";
                            else if (addIn.amount === 1.5) amountText = "Extra";

                            selectedAddInsMap[addIn.id] = amountText;
                        }
                    });
                    setSelectedAddIns(selectedAddInsMap);
                    setExpanded(true);
                }
            } catch (err) {
                console.error("Error fetching add-ins:", err);
                setError("Unable to load add-ins.");
            }
        };

        fetchAddIns();
    }, [itemToEdit]);

    useEffect(() => {
        const fetchBaseItem = async () => {
            if (isEditMode && itemToEdit?.itemId) {
                try {
                    const res = await fetch(`/api/menu/${itemToEdit.itemId}`);
                    if (!res.ok) throw new Error("Failed to fetch item.");
                    const data = await res.json();
                    setMenuItem(data);
                } catch (err) {
                    console.error("Error fetching base item:", err);
                    setMenuItem(item);
                }
            }
        };

        fetchBaseItem();
    }, [isEditMode, itemToEdit, item]);

    useEffect(() => {
        if (item && !isEditMode) {
            setMenuItem(item);
        }
    }, [item, isEditMode]);


    if (!menuItem) return null;

    const basePrice = formatPrice(menuItem.price);
    const sizeUpcharge = size === "Medium" ? 0.75 : size === "Large" ? 1.10 : size === "Extra Large" ? 1.50 : 0;

    const addInsArray = Object.entries(selectedAddIns)
        .map(([id, amount]) => {
            const addIn = addIns.find((a) => a._id === id);
            if (!addIn || amount === "None") return null;
            const quantity = amount === "Easy" ? 0.5 : amount === "Regular" ? 1 : 1.5;
            return { _id: id, name: addIn.name, price: addIn.price, amount: quantity };
        }).filter(Boolean);

    const totalAddInsPrice = addInsArray.reduce((total, addIn) => total + addIn.price * addIn.amount, 0);

    // Calculate price (basePrice + sizeUpcharge)
    const price = basePrice + sizeUpcharge;

    // Calculate totalPrice based on category
    const totalPrice = isSnack ? basePrice * quantity : (price + totalAddInsPrice) * quantity;

    const baseOrderItem = {
        itemId: menuItem._id,
        name: menuItem.name,
        category: menuItem.category,
        imagePath: menuItem.image,
        altText: menuItem.alt || menuItem.name,
        quantity,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        basePrice: basePrice
    };

    const orderItem = isSnack
        ? {
            ...baseOrderItem,
            price: parseFloat(basePrice.toFixed(2))
        }
        : {
            ...baseOrderItem,
            type,
            size,
            addIns: addInsArray.map(addIn => ({
                id: addIn._id,
                name: addIn.name,
                amount: addIn.amount,
                price: parseFloat((addIn.price * addIn.amount).toFixed(2))
            })),
            price: parseFloat(price.toFixed(2)),
            addInsPrice: parseFloat(totalAddInsPrice.toFixed(2))
        };

    const resetAndClose = () => {
        setType("Iced");
        setSize("Small");
        setQuantity(1);
        setSelectedAddIns({});
        setExpanded(false);
        setError("");

        // Clear the item being edited if there is one
        if (itemToEdit) {
            setItemForEdit(null);
        }

        onClose();
    };

    const handleAddToCart = async () => {
        if (quantity <= 0) {
            setError('Quantity must be at least 1');
            return;
        }

        setIsSubmitting(true);
        try {
            let success;

            if (isEditMode && itemToEdit) {
                // Check if anything has changed
                const hasChanges =
                    type !== itemToEdit.type ||
                    size !== itemToEdit.size ||
                    quantity !== itemToEdit.quantity ||
                    JSON.stringify(addInsArray.map(a => ({ id: a._id, amount: a.amount })).sort()) !==
                    JSON.stringify((itemToEdit.addIns || []).map(a => ({ id: a.id, amount: a.amount })).sort());

                if (hasChanges) {
                    // Calculate the correct price based on changes

                    // Calculate the correct base price without add-ins
                    const originalBasePrice = basePrice;
                    const newSizeUpcharge = size === "Medium" ? 0.75 : size === "Large" ? 1.10 : size === "Extra Large" ? 1.50 : 0;
                    const unitPrice = originalBasePrice + newSizeUpcharge;
                    const newAddInsPrice = parseFloat(totalAddInsPrice.toFixed(2));
                    const newTotalPrice = isSnack ? originalBasePrice * quantity : (unitPrice + newAddInsPrice) * quantity;

                    const updatedItem = {
                        ...itemToEdit,
                        type,
                        size,
                        quantity,
                        basePrice: originalBasePrice,
                        addIns: addInsArray.map(addIn => ({
                            id: addIn._id,
                            name: addIn.name,
                            amount: addIn.amount,
                            price: parseFloat((addIn.price * addIn.amount).toFixed(2))
                        })),
                        price: parseFloat(unitPrice.toFixed(2)),
                        addInsPrice: newAddInsPrice,
                        totalPrice: parseFloat(newTotalPrice.toFixed(2))
                    };
                    success = await updateCartItem(updatedItem);
                } else if (quantity !== itemToEdit.quantity) {
                    // Calculate the new total price based on the item's category
                    const newTotalPrice = itemToEdit.category === 4
                        ? parseFloat((itemToEdit.basePrice * quantity).toFixed(2))
                        : parseFloat(((itemToEdit.price + (itemToEdit.addInsPrice || 0)) * quantity).toFixed(2));

                    const updatedItem = {
                        ...itemToEdit,
                        quantity,
                        totalPrice: newTotalPrice
                    };
                    success = await updateCartItem(updatedItem);
                } else {
                    resetAndClose();
                    return;
                }

                if (success) {
                    resetAndClose();
                } else {
                    setError('Failed to update item. Please try again.');
                }
            } else {
                // Add a new ite
                success = await addItemToCart(orderItem);
                if (success) {
                    resetAndClose();
                } else {
                    setError('Failed to add item to order. Please try again.');
                }
            }
        } catch (error) {
            setError(isEditMode ? 'Failed to update item. Please try again.' : 'Failed to add item to order. Please try again.');
            console.error(isEditMode ? 'Error updating item:' : 'Error adding to order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={resetAndClose}>
            <div className="modal-content p-2 pt-4 md:p-4 md:pt-8" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <button
                    className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-800"
                    onClick={resetAndClose}
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div className="flex flex-col h-full">
                    <div className="relative h-[250px] md:h-[300px] mx-4 md:mx-28 mt-2 mb-6 rounded overflow-hidden">
                        <Image
                            src={`/images/menu/${menuItem.image}`}
                            alt={menuItem.alt || menuItem.name}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto px-2">
                        <h4 className="text-xl font-bold mb-1">{menuItem.name}</h4>
                        <p className="text-sm mb-4">{menuItem.description}</p>

                        {!isSnack && (
                            <div className="mb-4">
                                <div className="inline-block w-[48%] mr-2">
                                    <label className="block text-sm font-medium mb-1" htmlFor="size">Size</label>
                                    <select
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        className="block w-full p-2 mb-2 border border-teal-800/50 rounded-lg bg-neutral-50 focus:ring-teal-800/50 focus:border-teal-800/50 hover:cursor-pointer">
                                        <option value="Small">Small</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Large">Large</option>
                                        <option value="Extra Large">Extra Large</option>
                                    </select>
                                </div>
                                <div className="inline-block w-[48%] md:w-[50%]">
                                    <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="block w-full p-2 mb-2 border border-teal-800/50 rounded-lg bg-neutral-50 focus:ring-teal-800/50 focus:border-teal-800/50 hover:cursor-pointer">
                                        <option value="Iced">Iced</option>
                                        <option value="Blended">Blended</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {!isSnack && (
                            <div className="mb-2 border border-neutral-300 rounded-lg bg-neutral-50">
                                <button type="button" className="flex items-center justify-between w-full px-4 py-2 border-b border-neutral-300 hover:cursor-pointer"
                                    onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
                                    <span>Add-Ins</span>
                                    <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : "rotate-0"}`} fill="none" stroke="teal" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expanded && (
                                    <div className="h-[200px] md:h-[250px] overflow-y-scroll p-4">
                                        <p className="text-xs md:text-sm mb-4">Select any additions you want added to your drink.</p>
                                        {addIns.map((addIn) => (
                                            <div key={addIn._id} className="flex items-center mb-2">
                                                <div className="basis-2/3 pr-2">
                                                    <p className="font-medium text-xs md:text-sm">{addIn.name}</p>
                                                    <p className="text-xs">{addIn.description}</p>
                                                </div>
                                                <select
                                                    value={selectedAddIns[addIn._id] || "None"}
                                                    className="basis-1/3 p-1 text-xs md:text-sm border border-teal-800/50 rounded-lg bg-neutral-50 hover:cursor-pointer"
                                                    onChange={(e) =>
                                                        setSelectedAddIns((prev) => ({
                                                            ...prev,
                                                            [addIn._id]: e.target.value,
                                                        }))
                                                    }>
                                                    <option value="None">None</option>
                                                    <option value="Easy">Easy</option>
                                                    <option value="Regular">Regular</option>
                                                    <option value="Extra">Extra</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4 md:mt-8">
                            <div className="flex items-center gap-2 w-1/3 md:w-1/4">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-6 h-6 p-2 flex items-center justify-center rounded-full border border-neutral-300 text-xl hover:cursor-pointer">−</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min={1}
                                    onBlur={validateQuantityOnBlur}
                                    className="w-16 text-center p-2 border rounded"
                                />
                                <button onClick={() => setQuantity(q => q + 1)}
                                    className="w-6 h-6 p-2 flex items-center justify-center rounded-full border border-neutral-300 text-xl hover:cursor-pointer">+</button>
                            </div>
                            <button className="actionButton" disabled={isSubmitting || isLoading}
                                onClick={handleAddToCart}>
                                {isSubmitting || isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? `Update Item - $ ${totalPrice.toFixed(2)}` : `Add to Order - $ ${totalPrice.toFixed(2)}`)}
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
