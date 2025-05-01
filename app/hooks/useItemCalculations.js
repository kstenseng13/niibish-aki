"use client";

export function useItemCalculations() {
    const calculateSizeUpcharge = (size) => {
        return size === "Medium" ? 0.75 :
            size === "Large" ? 1.10 :
                size === "Extra Large" ? 1.50 : 0;
    };

    const calculateAddInsPrice = (addIns) => {
        if (!addIns || !Array.isArray(addIns) || addIns.length === 0) {
            return 0;
        }

        return addIns.reduce((total, addIn) => {
            if (!addIn) return total;
            const price = parseFloat(addIn.price || 0);
            const amount = parseFloat(addIn.amount || 1);
            return total + (price * amount);
        }, 0);
    };

    const calculateItemTotalPrice = (item) => {
        if (!item) return 0;

        // For snacks (category 4)
        if (item.category === 4) {
            const basePrice = parseFloat(item.basePrice || item.price || 0);
            const quantity = parseInt(item.quantity || 1);
            return basePrice * quantity;
        }

        // For drinks
        const basePrice = parseFloat(item.basePrice || item.price || 0);
        const sizeUpcharge = calculateSizeUpcharge(item.size);
        const addInsPrice = calculateAddInsPrice(item.addIns);
        const quantity = parseInt(item.quantity || 1);

        const unitPrice = basePrice + sizeUpcharge + addInsPrice;
        return unitPrice * quantity;
    };

    const formatPrice = (price) => {
        if (typeof price === 'object' && price !== null && price.$numberDecimal) {
            return parseFloat(price.$numberDecimal);
        }
        return parseFloat(price || 0);
    };

    const prepareCartItem = (menuItem, customizations = {}) => {
        if (!menuItem) return null;

        const itemPrice = formatPrice(menuItem.price);

        // Create base cart item
        const cartItem = {
            itemId: menuItem._id,
            name: menuItem.name,
            category: menuItem.category,
            imagePath: menuItem.image,
            altText: menuItem.alt || menuItem.name,
            quantity: customizations.quantity || 1
        };

        // Add category-specific properties
        if (menuItem.category === 4) { // Snack
            cartItem.price = itemPrice;
            cartItem.basePrice = itemPrice;
            cartItem.totalPrice = itemPrice * cartItem.quantity;
        } else { // Drink
            cartItem.type = customizations.type || 'Iced';
            cartItem.size = customizations.size || 'Small';
            cartItem.price = itemPrice;
            cartItem.basePrice = itemPrice;

            if (customizations.addIns && customizations.addIns.length > 0) {
                cartItem.addIns = customizations.addIns.map(addIn => ({
                    id: addIn.id || addIn._id,
                    name: addIn.name,
                    amount: addIn.amount || 1,
                    price: addIn.price || 0
                }));

                cartItem.addInsPrice = calculateAddInsPrice(cartItem.addIns);
            }
            cartItem.totalPrice = calculateItemTotalPrice(cartItem);
        }

        return cartItem;
    };

    return {
        calculateSizeUpcharge,
        calculateAddInsPrice,
        calculateItemTotalPrice,
        formatPrice,
        prepareCartItem
    };
}
