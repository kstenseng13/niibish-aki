"use client";

/**
 * Hook for calculating item prices and related values
 * Provides a single source of truth for all price calculations
 */
export function useItemCalculations() {
    /**
     * Calculate size upcharge based on size
     * @param {string} size - The size of the item (Small, Medium, Large, Extra Large)
     * @returns {number} - The upcharge amount
     */
    const calculateSizeUpcharge = (size) => {
        return size === "Medium" ? 0.75 :
               size === "Large" ? 1.10 :
               size === "Extra Large" ? 1.50 : 0;
    };

    /**
     * Calculate the total price for add-ins
     * @param {Array} addIns - Array of add-in objects
     * @returns {number} - Total price of all add-ins
     */
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

    /**
     * Calculate the total price for an item
     * @param {Object} item - The item object
     * @returns {number} - The total price
     */
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

    /**
     * Format a MongoDB Decimal128 price or regular price
     * @param {any} price - The price value (could be object or number)
     * @returns {number} - The parsed price as a number
     */
    const formatPrice = (price) => {
        if (typeof price === 'object' && price !== null && price.$numberDecimal) {
            return parseFloat(price.$numberDecimal);
        }
        return parseFloat(price || 0);
    };

    /**
     * Prepare an item for adding to cart with all necessary calculations
     * @param {Object} menuItem - The menu item from the database
     * @param {Object} customizations - Customization options (size, type, addIns, quantity)
     * @returns {Object} - The prepared cart item
     */
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

            // Add add-ins if provided
            if (customizations.addIns && customizations.addIns.length > 0) {
                cartItem.addIns = customizations.addIns.map(addIn => ({
                    id: addIn.id || addIn._id,
                    name: addIn.name,
                    amount: addIn.amount || 1,
                    price: addIn.price || 0
                }));
                
                cartItem.addInsPrice = calculateAddInsPrice(cartItem.addIns);
            }

            // Calculate total price
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
